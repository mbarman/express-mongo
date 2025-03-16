class ApiFeature {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // filter data
    filter() {
        const queryObj = {...this.queryString};
        const excludedParams = ['page', 'sort', 'limit', 'fields'];
        excludedParams.forEach(param => delete queryObj[param]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    //sort data

    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt'); // pagination may not work as expected if this data is same
        }
        return this;
    }

    // limiting fields -- Projection

    limit() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').map(field => field.trim());
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v'); // remove the __V field from respopnse
        }
        return this;
    }

    // pagination

    paginate() {
        const page = this.queryString.page * 1 || 1; // page  no
        const limit = this.queryString.limit * 1 || 10; // page size
        const skip = (page - 1) * limit; // no of records to skip

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeature;