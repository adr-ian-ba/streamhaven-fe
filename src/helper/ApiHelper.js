class ApiHelper {
    constructor(url) {
        this.url = url
    }

    async get(endpoint){
       const response = await fetch(`${this.url}${endpoint}`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
       })

       if(!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`)
       }
    //    console.log(await response.json())
       return await response.json()
    }

    async post(endpoint, payload){
        const response = await fetch(`${this.url}${endpoint}`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(payload)
        })

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json()

    }

    async getAuthorization(endpoint, auth){
        const response = await fetch(`${this.url}${endpoint}`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : auth
            }
        })

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json()
    }

    async postAuthorization(endpoint, payload, auth){
        const response = await fetch(`${this.url}${endpoint}`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : auth
            },
            body : JSON.stringify(payload)
        })

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json()

    }

    async postFormAuthorization(endpoint, formData, auth) {
        const response = await fetch(`${this.url}${endpoint}`, {
            method: "POST",
            headers: {
                "Authorization": auth
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    }

      async deleteAuthorization(endpoint, auth) {
    const response = await fetch(`${this.url}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  }

  async putAuthorization(endpoint, payload, auth) {
  const response = await fetch(`${this.url}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}




    
}

const apiHelper = new ApiHelper("http://localhost:3000")
// const apiHelper = new ApiHelper("https://streamhaven-be.onrender.com")

export default apiHelper