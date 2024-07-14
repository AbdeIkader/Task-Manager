export class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  //1-Pagination
  pagination() {
    const PAGE_LIMIT = this.queryString.limit * 1 || 3; // Use limit from query or default to 3
    let PAGE_NUMBER = this.queryString.page * 1 || 1;
    if (this.queryString.page <= 0) PAGE_NUMBER = 1;
    const PAGE_SKIP = (PAGE_NUMBER - 1) * PAGE_LIMIT; // Skip documents

    this.mongooseQuery.skip(PAGE_SKIP).limit(PAGE_LIMIT);
    return this;
  }

  //2-Filteration
  filteration() {
    let filterObj = { ...this.queryString };
    let excludedQuery = ["page", "sort", "fields", "keyword", "limit"];
    excludedQuery.forEach((ele) => delete filterObj[ele]);
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    filterObj = JSON.parse(filterObj);

    if (filterObj.name) {
      filterObj.name = { $regex: filterObj.name, $options: "i" }; // Filter by category name
    }
    if (filterObj.isShared) {
      filterObj.isShared = filterObj.isShared === "true"; // Convert to boolean
    }

    this.mongooseQuery.find(filterObj);
    return this;
  }

  //3-Sort
  sort() {
    if (this.queryString.sort) {
      let sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortedBy);
    }
    return this;
  }

  //4-Search
  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  //5-Fields
  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
}
