function SaveItem(pSaveName, pTimeStamp) {
    this.clickCount = 0;
    this.clickCountMax = 0;
    this.saveName = pSaveName;
    this.timestamp = pTimeStamp;

    this.GetSaveName = function () {
        return this.saveName;
    };

    this.GetTimeStamp = function () {
        return this.timestamp;
    };

    this.GetClickCount = function () {
        return this.clickCount;
    };

    this.SetClickCount = function (pClickCount) {
        this.clickCount = pClickCount;
    };

    this.ClickSave = function () {
        this.clickCount++;
        if (this.clickCount >= this.clickCountMax) {
            // TODO: overwrite the save
            console.log("Overwrite save triggered.");
        }
    };
}