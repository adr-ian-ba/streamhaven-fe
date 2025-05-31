export function getPagination(low = 1, high, current, visiblePage = 3){
    let pages = []
    
    if(high < visiblePage){
        for(let i = 0; i< high ; i++){
            pages.push(i+1)
        }
        return pages
    }

    if(high <= visiblePage){
        for(let i = 0; i< visiblePage ; i++){
            pages.push(i+1)
        }
        return pages
    }

    if(current - visiblePage <= low){
        for(let i = 0; i< visiblePage; i++){
            pages.push(i+1)
        }
        pages.push("...")
        pages.push(high)
        return pages
    }

    if (current + visiblePage >= high) {
        pages.push(1);
        pages.push("...");
        for (let i = high - visiblePage + 1; i <= high; i++) {
            pages.push(i);
        }
      return pages
    }

    pages.push(low)
    pages.push("...")
    for(let i= current-visiblePage; i<current+visiblePage ;i++){
        pages.push(i)
    }
    pages.push("...")
    pages.push(high)
    return pages

}

