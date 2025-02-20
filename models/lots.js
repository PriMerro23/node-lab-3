const lots = [];

class Lot {
    static STATUS_ACTIVE = 'active';
    static STATUS_INACTIVE = 'inactive';

    constructor(
        id,
        title,
        description,
        startPrice,
        currentPrice,
        status,
        startTime,
        endTime,
        userId
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startPrice = startPrice;
        this.currentPrice = currentPrice;
        this.status = status;
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
        this.userId = userId;
    }
}

module.exports = { Lot, lots };
