import DataModule from './modules/data';
import '../css/style.scss';

const dataM = new DataModule();

// 제목 세팅
function setTitle() {
    const element = document.createElement('h1');
    element.innerHTML = '예약 목록'
    element.classList.add('hello');
    document.body.appendChild(element);
}

// 메인 구조 세팅
function mainStructure() {
    const element = document.createElement('div');
    element.id = 'root';
    element.innerHTML = `<div id='rez-list'></div><div id='rez-detail'></div>`;
    document.body.appendChild(element);
}


// 예약 데이터 세팅해주기
const setReservations = async () => {
    const element = document.getElementById('rez-list');

    let reservations = dataM.rezData.filter(data => data.status !== 'done');
    if (!dataM.rezData || dataM.rezData.length === 0) {
        await dataM.getReservations();
        reservations = dataM.rezData;
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
            dataM.onClickBtn(event.target.dataset.id);
            setReservations();
        }
    }
}




window.onload = async () => {
    setTitle();
    mainStructure();
    await setReservations();
}



