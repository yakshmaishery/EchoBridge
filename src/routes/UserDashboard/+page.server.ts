import type {redirect, Action, Actions} from '@sveltejs/kit'
import type { PageServerLoad } from './$types'; 

export const load: PageServerLoad = async ({ cookies,fetch }) => {
  const UserIDDeafult = cookies.get("UserIDDeafult")
  const res = await fetch("https://api64.ipify.org/?format=json")
  const ip = await res.json()
	return {
		UserIDDeafult:UserIDDeafult?.toString(),
    ip:ip.ip
	};
};

export const actions:Actions = {
    SetAnotherIDDefault: async ({ request ,cookies}) => {
      const formData = await request.formData();
      let AnotherIDDeafult = formData.get('UserIDDeafult');
      //console.log("Emai: ",email)
      if(!AnotherIDDeafult){
        AnotherIDDeafult = ""
      }
        cookies.set("UserIDDeafult",AnotherIDDeafult.toString().toLowerCase(),{
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true, // only if you're using HTTPS
            maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
        })
      // Process the form data and perform actions

      //throw redirect(300,"/Profile")
      return {status:200,message:"This is working",cookievalue:cookies.get("UserIDDeafult")}
    },

    getCookie: async ({ request ,cookies}) => {
        const UserIDDeafult = cookies.get("UserIDDeafult")
        return {
            UserIDDeafult:UserIDDeafult?.toString()
        }
    },
    RemoveanotherIDDefault: async ({ request ,cookies}) => {
        if(cookies.get("UserIDDeafult")){
            cookies.delete("UserIDDeafult",{path:"/"})
        }
    }
  };

