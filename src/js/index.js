import DataModule from './modules/data';
import '../css/style.scss';

class SetHtml {
    constructor() {
        this.dataModule = new DataModule();
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


    // 예약 데이터 리스트 세팅해주기
    setReservations = async () => {
        const element = document.getElementById('rez-list');

        let reservations = this.dataModule.rezData.filter(data => data.status !== 'done');
        if (!this.dataModule.rezData || this.dataModule.rezData.length === 0) {
            await this.dataModule.getReservations();
            reservations = this.dataModule.rezData;
        }

        let rezStr = '';
        for (const data of reservations) {
            const rDate = new Date(data.timeReserved);
            rezStr = rezStr + `
                <div class='rez' data-id='${data.id}'>
                    <div class='info1' data-id='${data.id}'>
                        <span data-id='${data.id}'>${rDate.getHours()} :
                        ${rDate.getMinutes() === 0 ? '00' : rDate.getMinutes()}</span>
                        <span data-id='${data.id}' ${data.status === 'reserved' ? 'style="color: #3BB94C">예약</span >' : 'style="color: #162149">착석 중</span>'}
                    </div>
                    <div class='info2' data-id='${data.id}'>
                        <span data-id='${data.id}'>${data.customer.name} - ${data.tables.map(d => d.name).join(', ')}</span>
                        <span data-id='${data.id}'>성인 ${data.customer.adult} 아이 ${data.customer.child}</span>
                        <span data-id='${data.id}'>${data.menus.map(d => d.name + '(' + d.qty + ')').join(', ')}</span>
                    </div>
                    <div class='info3' data-id='${data.id}'>
                        <button data-id='${data.id}' ${data.status === 'reserved' ? 'class="btn reserved">착석</button >' : 'class="btn seated">퇴석</button>'}
                    </div>
                </div>
            `;
        }
        element.innerHTML = rezStr;

        // 예약 목록 상태 변환 버튼 클릭
        for (const element of document.getElementsByClassName('btn')) {
            element.onclick = (event) => {
                this.dataModule.rezChange(event.target.dataset.id);

                // 데이터가 모두 지워졌을 때
                if (this.dataModule.rezData.length - this.dataModule.rezData.filter(d => d.status === 'done').length === 0) {
                    document.getElementById('root').innerHTML = '<p>예약목록이 없습니다.</P>'
                    return;
                }
                this.setReservations();
            }
        }

        // 예약 목록 클릭
        for (const element of document.getElementsByClassName('rez')) {
            element.onclick = (event) => {
                // 상태변환 버튼 클릭시에는 효과 없도록
                event.stopPropagation();
                if (event.target.className.indexOf('btn') !== -1) {
                    return;
                }
                this.setRezDetail(event.target.dataset.id);

                // desktop 일때
                if (window.innerWidth > 1024) {
                    document.getElementById('rez-detail').classList.remove('show');
                    return;
                }
                // mobile 일때
                if (document.getElementById('rez-detail').className.indexOf('show') === -1) {
                    document.getElementById('rez-detail').classList.add('show');
                } else {
                    document.getElementById('rez-detail').classList.remove('show');
                }
            }
        }
    }

    // 예약 데이터 상세 보여주기
    setRezDetail(id) {
        const element = document.getElementById('rez-detail');
        this.dataModule.rezDetail = this.dataModule.rezData[0];
        for (const rez of this.dataModule.rezData) {
            if (rez.id === id) {
                this.dataModule.rezDetail = rez;
            }
        }
        const detailD = this.dataModule.rezDetail;
        const timeR1 = new Date(detailD.timeReserved);
        const timeR2 = new Date(detailD.timeRegistered);
        const timeR = `${detailD.timeReserved.split(' ')[0]} ${timeR1.getHours()} : ${timeR1.getMinutes() < 10 ? '0' + timeR1.getMinutes() : timeR1.getMinutes()}`;
        const timeRst = `${detailD.timeRegistered.split(' ')[0]} ${timeR2.getHours()} : ${timeR2.getMinutes() < 10 ? '0' + timeR2.getMinutes() : timeR2.getMinutes()}`;
        const rezStr = `
            <div class='pop'>
                <span class='pop-close'>닫기</span>
                <h3>예약 정보</h3>
                <table>
                    <tbody>
                        <tr><td><span>예약 상태</span></td><td><span>${detailD.status === 'reserved' ? '착석 중' : '퇴석' || '-'}</span></td></tr>
                        <tr><td><span>예약 시간</span></td><td><span>${timeR || '-'}</span></td></tr>
                        <tr><td><span>접수 시간</span></td><td><span>${timeRst || '-'}</span></td></tr>
                    </tbody>
                </table>
                <h3>고객 정보</h3>
                <table>
                    <tbody>
                        <tr><td><span>고객 성명</span></td><td><span>${detailD.customer.name || '-'}</span></td></tr>
                        <tr><td><span>고객 등급</span></td><td><span>${detailD.customer.level || '-'}</span></td></tr>
                        <tr><td><span>고객 메모</span></td><td><span class='ellipsis3'>${detailD.customer.memo || '-'}</span></td></tr>
                        <tr><td><span>요청사항</span></td><td><span class='ellipsis3'>${detailD.customer.request || '-'}</span></td></tr>
                    </tbody>
                </table>
            </div>
        `;
        element.innerHTML = rezStr;
    }

    // 팝업 클릭 이벤트
    clickPop() {
        const popBg = document.getElementById('rez-detail');
        const pop = document.getElementsByClassName('pop');
        popBg.onclick = (event) => {
            event.stopPropagation();
            console.log(event);
            if (event.target.id === 'rez-detail' || event.target.className.indexOf('pop-close') !== -1) {
                popBg.className = '';
            }
        }
    }
}

window.onload = async () => {
    const setHtml = new SetHtml();
    setHtml.setTitle();
    setHtml.mainStructure();
    await setHtml.setReservations();
    setHtml.setRezDetail();
    setHtml.clickPop();
}



