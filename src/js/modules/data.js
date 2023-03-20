export default class DataModule {
    rezData = [];
    rezDetail = {};

    constructor() {

    }

    // 예약 데이터 api 호출
    getData() {
        return fetch(`https://frontend.tabling.co.kr/v1/store/9533/reservations`);
    }

    // 예약 데이터 가져오기
    getReservations = async () => {
        try {
            const res = await this.getData();
            if (!res.ok || res.status !== 200) {
                alert('에러가 발생했습니다.');
                this.rezData = [];
            }

            const response = await res.json();
            this.rezData = response.reservations.filter(data => data.status !== 'done');
            this.rezDetail = this.rezData[0];
        } catch (e) {
            console.log(e);
            this.rezData = [];
        }
    }

    /**
     * 예약 내용 변경 (착석/퇴석)
     * @param data: 선택한 데이터 
     */
    rezChange = (id) => {
        let type = 'reserved';
        for (const d of this.rezData) {
            if (d.id === id) {
                type = d.status === 'reserved' ? d.status : 'seated';
            }
        }

        switch (type) {
            case 'reserved':
                this.rezData = this.rezData.map(d => {
                    if (id === d.id) {
                        d.status = 'seated';
                    }
                    return d;
                })
                break;
            case 'seated':
                this.rezData = this.rezData.map(d => {
                    if (id === d.id) {
                        d.status = 'done';
                    }
                    return d;
                })
        }
    }
}