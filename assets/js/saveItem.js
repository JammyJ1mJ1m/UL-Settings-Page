function SaveItem(pSaveName, pTimeStamp, pID) {
    this.saveName = pSaveName;
    this.timestamp = new Date(pTimeStamp * 1000);
    this.id = pID;

    this.GetSaveName = function () {
        return this.saveName;
    };

    this.GetRawTimeStamp = function () {
        return timestamp; // Convert to seconds
    }
    this.GetTimeStamp = function () {
        const day = this.timestamp.getDate().toString().padStart(2, '0');
        const month = (this.timestamp.getMonth() + 1).toString().padStart(2, '0');
        const year = this.timestamp.getFullYear();

        const hours = this.timestamp.getHours().toString().padStart(2, '0');
        const minutes = this.timestamp.getMinutes().toString().padStart(2, '0');
        const seconds = this.timestamp.getSeconds().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    this.GetClickCount = function () {
        return this.clickCount;
    };

    this.SetClickCount = function (pClickCount) {
        this.clickCount = pClickCount;
    };

    this.OverWrite = function (pSaveItem) {

        //Talking to the C++ save system should be handled here


       // this.saveName = pSaveItem.GetSaveName();
        this.timestamp = pSaveItem.timestamp;
        

    };

    this.GetID = function () {
        return this.id;
    }


}