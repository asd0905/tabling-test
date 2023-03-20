import DataModule from './modules/data';
import '../css/style.scss';

class SetHtml extends DataModule {
    constructor() {
        super();
    }

    // 제목 세팅
    setTitle() {
        const element = document.createElement('h1');
        element.innerHTML = '예약 목록'
        element.classList.add('hello');
        document.body.appendChild(element);
    }

    // 메인 구조 세팅
    mainStructure() {
        const element = document.createElement('div');
        element.id = 'root';
        element.innerHTML = `<div id='rez-list'></div><div id='rez-detail'></div>`;
        document.body.appendChild(element);
    }


    // 예약 데이터 세팅해주기
    setReservations = async () => {
        const element = document.getElementById('rez-list');

        let reservations = this.rezData.filter(data => data.status !== 'done');
        if (!this.rezData || this.rezData.length === 0) {
            await this.getReservations();
            reservations = this.rezData;
        }

        let rezStr = '';
        for (const data of reservations) {
            rezStr = rezStr +
                `
                <div>
                    <div class='info1'>
                        <span>${new Date(data.timeReserved).getHours()} :
                        ${new Date(data.timeReserved).getMinutes() === 0 ? '00' : new Date(data.timeReserved).getMinutes()}</span>
                        ${data.status === 'reserved' ? '<span style="color: #3BB94C">예약</span >' : '<span style="color: #162149">착석 중</span>'}
                    </div>
                    <div class='info2'>
                        <span>${data.customer.name} - ${data.tables.map(d => d.name).join(', ')}</span>
                        <span>성인 ${data.customer.adult} 아이 ${data.customer.child}</span>
                        <span>${data.menus.map(d => d.name).join(', ')} ${data.menus.reduce((a, b) => a + b.qty, 0)}</span>
                    </div>
                    <div class='info3'>
                        <button data-id='${data.id}' ${data.status === 'reserved' ? 'class="btn reserved">착석</button >' : 'class="btn seated">퇴석</button>'}
                    </div>
                </div>
            `;
        }

        console.log(rezStr);
        element.innerHTML = rezStr;

        for (const element of document.getElementsByClassName('btn')) {
            element.onclick = (event) => {
                console.log(event.target.dataset.id);
                this.rezChange(event.target.dataset.id);
                this.setReservations();
            }
        }
    }
}
const setHtml = new SetHtml();



window.onload = async () => {
    setHtml.setTitle();
    setHtml.mainStructure();
    await setHtml.setReservations();
}



