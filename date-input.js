
import DatePicker from "/date-picker.js"  

class  DateInput extends HTMLElement { 
    
    constructor() {
        super();
        this.calender = false;
        this.nowDate = new Date(this.getAttribute('') || Date.now());
        this.sForbiddenDateMin = "09/30/2022";
        this.sForbiddenDateMax = "5-months";
        this.sCurrentSelectedDate;
        this.attachShadow({mode: 'open'});
      }
             
    connectedCallback() {
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removeds
    
        // shadow tree has its own style (2)
      this.shadowRoot.innerHTML = `
        <style>
        .calender-button{
          position: relative;
          top: 10px;
          left: -10px;
         height: 30px;
         width: 30px;       
           padding: -5px;
         }
         .calender-button:focus{    
          border: -5px;
         }        
       
        date-picker{
          position: absolute;
           margin-left: -15px;
           margin-top: -10px;
          z-index: 20;
        }
        </style> 
           <label for="date" id = "date-calender-label"> 
           Date:
            <input class= "input-date"  size = "10" maxlength = "10" pattern="-\d{2}-\d{2}-\d{4}" type="text" name="date" placeholder= "mm/dd/yyyy" id = "date-input-box" />  
           <input type = "image"  name="calender" src="Calendar-01-512.webp"class = "calender-button" id = "calender-button">
           </label>
      `;

      let dCalenderButton = this.shadowRoot.querySelector('#calender-button');     
       let dDateInput = this.shadowRoot.querySelector('#date-input-box');  
         
    

       dCalenderButton.addEventListener('click', (e)=>{
        if(this.calender){
           this.calender = false;
           document.body.removeChild(this.dDatePicker);
        }else{
           this.calender = true;
           this.dDatePicker = document.createElement("date-picker");
           this.dDatePicker.setAttribute("for",this.getAttribute("id") );
           this.dDatePicker.setAttribute("forbiddendatemin",this.sForbiddenDateMin);
           this.dDatePicker.setAttribute("forbiddendatemax",this.sForbiddenDateMax);
          //  this.dDatePicker.setAttribute("weekEndsOn",true);
           document.body.appendChild(this.dDatePicker);
           if(this.sCurrentSelectedDate !== undefined){
             this.dDatePicker.renderSelectedTypedDate(this.sCurrentSelectedDate.getTime());
           }
        }   
      });
       dDateInput.addEventListener('click', (e)=>{
        if( !this.calender ){
        this.calender = true;
        this.dDatePicker = document.createElement("date-picker");
        this.dDatePicker.setAttribute("for",this.getAttribute("id") );
        this.dDatePicker.setAttribute("forbiddendatemin",this.sForbiddenDateMin);
        this.dDatePicker.setAttribute("forbiddendatemax",this.sForbiddenDateMax);
        // this.dDatePicker.setAttribute("weekEndsOn",true);
        this.dDatePicker.focus();
        document.body.appendChild(this.dDatePicker);
        if(this.sCurrentSelectedDate !== undefined){
          this.dDatePicker.renderSelectedTypedDate(this.sCurrentSelectedDate.getTime());
        }
        }
        });   
        dDateInput.addEventListener('input',(e)=>{ 
           if(e.target.value.length == 10){
            let sDateTypedIn = e.target.value;
            let bValidDate = this.validatedate(""+sDateTypedIn);
            if(bValidDate){
              this.sCurrentSelectedDate = new Date(e.target.value);
              this.dDatePicker.renderSelectedTypedDate(this.sCurrentSelectedDate.getTime());
            }
           }
        });

   
    }

     validatedate(dateString){      
      let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;      
            
      // Match the date format through regular expression      
      if(dateString.match(dateformat)){      
          let operator = dateString.split('/');      
        
          // Extract the string into month, date and year      
          let datepart = [];      
          if (operator.length>1){      
              datepart = dateString.split('/');      
          }      
          let month= parseInt(datepart[0]);      
          let day = parseInt(datepart[1]);      
          let year = parseInt(datepart[2]);      
                
          // Create list of days of a month      
          let ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];      
          if (month==1 || month>2){      
              if (day>ListofDays[month-1]){      
                  ///This check is for Confirming that the date is not out of its range      
                  return false;      
              }      
          }else if (month==2){      
              let leapYear = false;      
              if ( (!(year % 4) && year % 100) || !(year % 400)) {      
                  leapYear = true;      
              }      
              if ((leapYear == false) && (day>=29)){      
                  return false;      
              }else      
              if ((leapYear==true) && (day>29)){      
                  return false;      
              }      
          }      
      }else{      
          return false;      
      }      
      return true;      
  }
  
  setDate(sDate){
    let dDateInputTextBox = this.shadowRoot.querySelector("#date-input-box");
    this.sCurrentSelectedDate = new Date (sDate);
    let iMonth = this.sCurrentSelectedDate.getMonth() + 1;
    let iDay = this.sCurrentSelectedDate.getDate();
    if(iMonth < 10){ iMonth = "0"+ iMonth;}
    if(iDay< 10){ iDay = "0" + iDay }
    dDateInputTextBox.value = iMonth + "/" + iDay + "/"+ this.sCurrentSelectedDate.getFullYear();
    this.dDatePicker.renderSelectedTypedDate(this.sCurrentSelectedDate.getTime());
     this.calender = false;
     document.body.removeChild(document.querySelector(`[for = ${this.getAttribute("id")}]`) );
  }
    
    disconnectedCallback(){


    }

}

customElements.define("date-input", DateInput);