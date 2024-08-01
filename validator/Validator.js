import validate from 'validatorjs';

class Validator {

    static async loginValidation(data)
    {
      let rules = {
        email : 'required|email',
        password : 'required'
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    }
    static async resetemailValidation(data)
    {
      let rules = {
        email : 'required|email',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    }

    static async resendemailValidation(data)
    {
      let rules = {
        email : 'required|email',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    }
   
    static async registerValidation(data)
    {
      let rules = {
        name : 'required|string',
        email : 'required|email|string',
        password : 'required'
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    }

    static async resetpasswordValidation(data)
    {
      let rules = {
        password : 'required',
        confirm_password : 'required',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    }
    static async contactmailValidation(data)
    {
      let rules = {
        name : 'required|string',
        email : 'required|email|string',
       // phone : 'required',
       // subject : 'required',
        body : 'required'
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    } 
    static async subscribermailValidation(data)
    {
      let rules = {
        email : 'required|email|string',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    }
    static async chnagepasswordValidation(data)
    {
      let rules = {
        old_password : 'required',
        new_password : 'required',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    } 

    static async updateuserinfoValidation(data)
    {
      let rules = {
        name : 'required',
        email : 'required',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    } 

    static async orderValidation(data)
    {
      
      let rules = {
        event_id : 'required|integer',
        first_name : 'required|string',
        last_name : 'required|string',
        billing_email : 'required|email|string',
        address : 'required|string',
        phone : 'required|string',
        quantity : 'required|integer',
        amount : 'required|integer',
        currency : 'required',
        card_Number : 'required',
        card_date : 'required',
        card_CVC : 'required|integer',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    } 

    static async becomeSellerValidation(data)
    {
      let rules = {
        user_id : 'required|integer',
        company_first_name : 'required|string',
        company_last_name : 'required|string',
        company_email : 'required|email|string',
        company_phone : 'required|string',
        company_country : 'required|string',
        company_city : 'required|string',
        company_address : 'required|string',
        // website_url : 'required|string',
       // tax_id : 'required|string',
        // google_map : 'required',
        //company_logo : 'required',
        //company_document : 'required',
        is_agree : 'required|integer',
        description : 'required',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    }

    static async becomeSellerValidationMobile(data)
    {
      let rules = {

        name : 'required|string',
        email : 'required|string',
        password : 'required|string',
        company_first_name : 'required|string',
        company_last_name : 'required|string',
        company_email : 'required|email|string',
        company_phone : 'required|string',
        company_country : 'required|string',
        company_city : 'required|string',
        company_address : 'required|string',
        // website_url : 'required|string',
        tax_id : 'required|string',
        // google_map : 'required',
        company_logo : 'required',
        company_document : 'required',
        is_agree : 'required|integer',
        description : 'required',
        };
        let validation = new validate(data, rules);
        if (validation.fails()) {
        return validation.errors.all();
        }
        return { success : true }; 
    } 
}

export default Validator;
