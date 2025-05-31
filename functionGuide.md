# Usage Guide
This file contains guide on how to use function that are present and created in this project

[Dialog](#dialog)


## Dialog
Dialog is reccomended use is for talking to consumers directly, this project have a Dialog components, it has 4 attribute
- title (string)
- useTitle (boolean)
- useClose (boolean)
- closeFunction (function)
##### usage Guide
```jsx
const parentComponent = () => {
  //useState for dialog
  const [open, setOpen] = useState(false)

  //control for opening and closing dialog
  const toggleOpen = () =>{
    setOpen(prevState => !prevState)
  }

  return (
    {open &&
      <Dialog 
        closeFunction={toggleOpen} 
        title="Dialog Title" 
        useTitle={true} 
        useClose={false}>

        <p>Content is placed in here</p>
        <button onClick={toggleOpen}>close</button>

      </Dialog>
    }
  )
}
```

I think you are smart enough to figure out what useTitle and useClose is, CloseFunction here is used to close dialog from inside the component, __toggleDialog__ here can also be used inside the dialog component in the parent.

## ApiHelper
api helper is defined in the helper folder, an instance have been created and can be used right away, if url needs to be changed it can be changed in the ApiHelper folder, this class have 2 main method
- get
- post
- getAuthorization
- postAuthorization
##### usage Guide
```js
//making a new api helper
const apiHelper = new ApiHelper("http://backendUrl")

//get method
const getData = async () => {
  const response = await apiHelper.get("/getendpoint")
  const response = await apiHelper.getAuthorization("/getendpoint", token)
}

//post method
const payload = {
  username : "name"
}
const postData = async (payload) =>{
  const response = await apiHelper.post("/postendpoint",payload)
  const response = await apiHelper.postAuthorization("/postendpoint",payload, token)
}
```
PUT and DELETE will be coming soon, but is curretly not a top priority

the authorization, basicly attach authorization bearer on he headers, wichh in this project is your token

## MovieGrid & Poster

movie grid and poster is used simultaneously, MovieGrid is the container and poster is the poster it self, poster can also be used independently

```js
<MovieGrid movies={movieList}>
  {children}
</MovieGrid>

```

## Toast
in this project toast needs to be renderen when there is a promise, the <Toaster/> it self is attached in the maion App file, the usage for the promise is ussualy as follows

```js
toast.promise(
  apiHelper.get("/endPoint").then((response)=>{
    if(!response.condition){
      toast.error(response.message)
      return
    }

    toast.success(response.message)
  })
)
```

## Copyright

Copyright © 2024 StreamHaven. All rights reserved.

This document is intended for [specific use, e.g., educational purposes, personal use, etc.]. Unauthorized copying, distribution, or modification is prohibited.









