const getUsername = document.querySelector('#user') as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector('.main_container') as HTMLElement;

//define contract of an object

interface UserData{
id:number;
login:string;
avatar_url:string;
url:string;
}
  
//reuseable function 

async function myCustomFetcher <T>(url:string , options? :RequestInit):Promise <T>
 {const response = await fetch (url,options);
    if(!response.ok){
        throw new Error(`Network was not ok - status ${response.status}`);
        
    }
    const data= await response.json();
console.log(data);
return data;
} 
//display the cardUI
const showResultUI=(singleUser:UserData)=>{
    const{ avatar_url,login,url}=singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
        <img src=${avatar_url}alt=${login}/>
        <hr/>
        <div class='card-footer'>
        <img src="${avatar_url}"alt=${login}/>
        <a href="${url}"> Github </a>
        </div>
        </div>
        `
    );

}
function fetchUserData(url:string){
    myCustomFetcher<UserData[]>(url,{}).then((userInfo)=>{
        for (const singleUser of userInfo){
            showResultUI(singleUser);
            console.log("login " + singleUser.login)
        }
    });
}

//deafault fun call 

fetchUserData ("https://api.github.com/users");
//let perform search fun
formSubmit.addEventListener("submit", async(e)=>{
    e.preventDefault();

    const searchTerm = getUsername.value.toLowerCase();

    try {
        const url ="https://api.github.com/users";

        let allUserData = await myCustomFetcher<UserData[]> (url,{});

        const matchingUsers  = allUserData.filter((user)=>{
            return user.login.toLowerCase().includes(searchTerm);
        })
        //we need to clear the previous data 
        main_container.innerHTML= "";
     
        if(matchingUsers.length===0){
            main_container?.insertAdjacentHTML(
                "beforeend",
                `<p class= "empty-msg"> no matching user found</p>`

            );
        }else {
            for( const singleUser of matchingUsers){
           showResultUI (singleUser);
            }
        }

        
    } catch (error){
        console.log(error);
    }
    }) 
        
    
