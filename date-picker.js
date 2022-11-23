export default class  DatePicker extends HTMLElement { 
    constructor(bWeekEndsOn) {
        super();
        this.sCurrentSelectedDate;
        this.iMonth;
        this.iYear;
        this.iDay;
        this.sForbiddenDateMin;
        this.sForbiddenDateMax;
        this.bCalenderMonthView = false; 
        this.iNumberOfClickOnDateButton = 0;
        this.bCalenderYearView = false;
        this.iStartDecadeYear;
        this.attachShadow({mode: 'open'});
      }
    connectedCallback() {
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removeds
        // shadow tree has its own style (2)
        this.shadowRoot.innerHTML = `
      <style>
      .date-picker-container{
        border: 3px solid #f1f1f1;
        transform: translate(0, 10px);
        padding: 1.0rem;
      }
      .full-calender-container {
          background-color: #FFFFFF; 
          display: grid;
          grid-template-areas: 'myArea myArea myArea myArea myArea  myArea myArea';
          height: auto;
          width: 210px;
          grid-template-columns: 20px 20px 20px 20px 20px 20px 20px;
          grid-template-rows: 20px 20px 20px 20px 20px 20px 20px;
          column-gap: 10px;
          row-gap: 10px;
          right: 10px;
      }
      .calender-month-view{
        background-color: #FFFFFF; 
        display: grid;
        grid-template-areas: 'myArea myArea myArea myArea ';
        column-gap: 10px;
        row-gap: 10px;
      }
      .calender-years-view{
        background-color: #FFFFFF; 
        display: grid;
        grid-template-areas: 'myArea myArea myArea myArea ';
        column-gap: 10px;
        row-gap: 10px;
      }
      .day-of-week{
        height: 25px;
        width: 25px;
        text-align: center;
        margin: 1px;
        border: 1px black solid;
      }
      .day-of-week-letters{
        height: 25px;
        width: 25px;
        text-align: center;
        border: 1px black solid;
      }
      .date-header{
        grid-column: 1 / 8;
        height: 30px;
        padding-bottom: 10px;
        width: 210px;
        margin-bottom: -5px;
      }
      .day-of-week button{
        height: 25px;
        width: 25px;
        background-color: Transparent;
        background-repeat:no-repeat;
        text-align: center;
        border: none;
      }
      button.current-date-selected{
        height: 25px;
        width: 25px;
        background-color: Transparent;
        border: 2px black solid;
        font-weight: 700; 
      }
      button.current-day{
        height: 25px;
        width: 25px;
        background-color: Transparent;
        padding: 1px;
        border: 2px black solid;
        border-radius: 15px;
        text-align: center;
        font-weight: 700; 
      }
      current-date-selected:foucs{
        height: 25px;
        width: 25px;
        background-color: Transparent;
        border-radius: 2px;
        border-color: black;
        text-align: center;
        font-weight: 1000; 
        background-color: gray;
      }
      .current-day:foucs{ 
        background-color: gray;
      }
      .day-of-week-button:focus{
        background-color: gray;
      }
      .prev-month{
        align:right;
      }
      .next-month{
        align:left;
      }
      .prev-and-next-label{
        width: 40%;
        margin-left: 34px;
        margin-right: 34px;
      }
      .prev-and-next-label:disabled{
        color: #000000;
      }
      .calender-month-view button{
        height: 55px;
      }
      .calender-years-view button{
        height: 55px;
      }
      button.current-month{
        border: 2px black solid;
      }
      </style>
      <div class="date-picker-container">
        <header class="date-header">
       <!-- <button class = "prev-and-next" id="prev-year" type="button">&lt;&lt;</button>-->
       <button class = "prev-month" id="prev-month" type="button">&lt;</button>
       <button class =  "prev-and-next-label" >MONTH</button>
        <button class = "next-month" id="next-month" type="button">&gt;</button>
       <!--  <button class = "prev-and-next" id="next-year" type="button">&gt;&gt;</button>-->
        </header>
        <div class ="calender">
          <div class="full-calender-container">
              <div class="day-of-week-letters">S</div>
              <div class="day-of-week-letters">M</div>
              <div class="day-of-week-letters">T</div>
              <div class="day-of-week-letters">W</div>
              <div class="day-of-week-letters">T</div>
              <div class="day-of-week-letters">F</div>
              <div class="day-of-week-letters">S</div>
          </div>    
          <div class ="calender-month-view">
              <button id ="month-1"> Jan   </button>
              <button id ="month-2"> Feb  </button>
              <button id ="month-3"> Mar   </button>
              <button id ="month-4"> Apr   </button>

              <button id ="month-5"> May   </button>
              <button id ="month-6"> Jun   </button>
              <button id ="month-7"> Jul  </button>
              <button id ="month-8"> Aug   </button>

              <button id ="month-9"> Sep   </button>
              <button id ="month-10"> Oct   </button>
              <button id ="month-11"> Nov   </button>
              <button id ="month-12" > Dec   </button>
          </div>
          <div  style = "display:none;"class ="calender-years-view">
              <button id ="year-1">   </button>
              <button id ="year-2">   </button>
              <button id ="year-3">    </button>
              <button id ="year-4">   </button>

              <button id ="year-5">    </button>
              <button id ="year-6">    </button>
              <button id ="year-7">   </button>
              <button id ="year-8">    </button>

              <button id ="year-9">    </button>
              <button id ="year-10">    </button>
              <button id ="year-11">    </button>
              <button id ="year-12" >    </button>
          </div>
        </div>
     </div>
      `;  
    
      this.popluateDateElements();

      //in beginning the calender-month-view is not shown 
      let dCalenderMonthView = this.shadowRoot.querySelector('.calender-month-view');
      dCalenderMonthView.style.display = 'none';
      let dCalenderYearView = this.shadowRoot.querySelector('.calender-years-view');

      let date = new Date(this.getAttribute('') || Date.now());

       //getting the month and year of now
       this.iMonth= date.getMonth() + 1;
       this.iYear = date.getFullYear();
       this.iDay = date.getDate();

      //render the current month and year label 
      let dMonthYearLabel = this.shadowRoot.querySelector('.prev-and-next-label');
      dMonthYearLabel.innerHTML =  this.getMonthInString()+ "-" + this.iYear ;
    
         //Update the month if prevmonth or nextmonth buttons are clicked
         let dPreMonthButton = this.shadowRoot.querySelector('#prev-month')
         dPreMonthButton.addEventListener('click', (e)=>{
         if(this.bCalenderMonthView ){
           this.iYear--;
           dMonthYearLabel.innerHTML = this.iYear;
           this.renderMonths();
         } else if (this.bCalenderYearView) {
           this.iStartDecadeYear -= 10;
           let iEndDeccadeYear = this.iStartDecadeYear + 10;
             dMonthYearLabel.innerHTML = this.iStartDecadeYear + "-" + iEndDeccadeYear ;
             this.renderDecadeYears();
         } else{
           this.moveToPrevMonth(dMonthYearLabel);
           this.renderDate();
          }
           });
   
         let dNextMonthButton = this.shadowRoot.querySelector('#next-month')
         dNextMonthButton.addEventListener('click', (e)=>{
           if(this.bCalenderMonthView ){
             this.iYear++;
             dMonthYearLabel.innerHTML = this.iYear;
             this.renderMonths();
           } else if (this.bCalenderYearView) {
               this.iStartDecadeYear += 10;
               let iEndDeccadeYear = this.iStartDecadeYear + 10;
               dMonthYearLabel.innerHTML = this.iStartDecadeYear + "-" + iEndDeccadeYear ;
               this.renderDecadeYears();
             }else{
               this.moveToNextMonth(dMonthYearLabel);
               this.renderDate();
             }
         });
  
      //when the month and year button is clicked
      dMonthYearLabel.addEventListener('click',(e)=>{
      let dFullCalenderView =  this.shadowRoot.querySelector('.full-calender-container');
      dFullCalenderView.style.display= 'none';
      dCalenderMonthView.style.display = '';

       //display the month view
      if(this.bCalenderMonthView === false && this.bCalenderYearView === false){
      dMonthYearLabel.innerHTML = this.iYear;
      this.bCalenderMonthView = true;
       //disabling months on the month view if the month is inculded in the sForbiddenDateMin
       this.renderMonths();
        for(let i = 1; i <= 12 ; i++){
          let dElementToChange = this.shadowRoot.querySelector('#month-' +i);
          dElementToChange.value = i;
          dElementToChange.addEventListener('click',(e)=>{
          this.bCalenderYearViewOnNextClick = false;
          this.iMonth = parseInt(e.target.value);
          dFullCalenderView.style.display= '';
          dCalenderMonthView.style.display = 'none';
          dMonthYearLabel.innerHTML =  dElementToChange.innerHTML + "-" + this.iYear ;
          this.bCalenderMonthView = false; 
          dMonthYearLabel.focus();
          this.renderDate();
          });}
        }else{
        //display the year view
        dMonthYearLabel.disabled = true;
        dCalenderMonthView.style.display = 'none';
        dCalenderYearView.style.display = '';
        this.bCalenderYearView = true;
        this.bCalenderMonthView = false;
        this.iStartDecadeYear = this.getStartOfDecade();
        let iEndDeccadeYear = this.iStartDecadeYear + 10;
        dMonthYearLabel.innerHTML = this.iStartDecadeYear + "-" + iEndDeccadeYear ;
        this.renderDecadeYears();
        for(let i = 1 ; i <= 10; i++){
          let dElementToChange = this.shadowRoot.querySelector('#year-' + i);
          dElementToChange.addEventListener('click',(e)=>{
            this.iYear = parseInt(e.target.value); 
            this.bCalenderMonthView = true;
            this.bCalenderYearView = false;
            dCalenderMonthView.style.display = '';
            dCalenderYearView.style.display = 'none';
            dMonthYearLabel.innerHTML = this.iYear;
            dMonthYearLabel.disabled = false;
            this.renderMonths();
          });}
        }
      });
  
       //Event Listeners for date buttons 
        let dDateInput = document.querySelector(`#${this.getAttribute("for")}`);
        if(dDateInput !== null){
          for(let i = 1; i <= 42 ; i++){
            let dElementToChange = this.shadowRoot.querySelector('#day-' +i);
            dElementToChange.addEventListener('click',(e)=>{
              this.iDay = e.target.value; 
              let date = this.iMonth  + "/" + this.iDay + "/" + this.iYear;
              dDateInput.setDate(date);
              this.shadowRoot.querySelector(".current-date-selected").focus();
          })
          } 
            }
          //checking what's passed down for forbiddendatemin and forbiddendatemax attributes
          this.sForbiddenDateMin = this.getAttribute("forbiddendatemin");
          this.sForbiddenDateMax =  this.getAttribute("forbiddendatemax");    
          this.checkMinMaxDate();

        //render the current month and year
          this.renderDate();
          //focus on arrow keys.
          let dCalender = this.shadowRoot.querySelector(".calender");
          dCalender.addEventListener('keydown', (e) => {
            const key = e.key;
            e.stopPropagation();
            const activeId = e.path[0].getAttribute("id");
            let iCurrentId = activeId.split("-")[1];
            const sElementIdentifer =  activeId.split("-")[0];
            let dPreNextElement = this.shadowRoot.querySelector("#day-"+ iCurrentId);
            if(sElementIdentifer === "day" || sElementIdentifer === "month" || sElementIdentifer === "year"){
            switch (key) {
              case "ArrowLeft":
                if(this.bCalenderMonthView){
                  if( iCurrentId  === '1'){
                     this.iYear--;
                     this.renderMonths();
                     dMonthYearLabel.innerHTML = this.iYear;
                     iCurrentId = 12;
                     dPreNextElement = this.shadowRoot.querySelector("#month-"+ iCurrentId);
                  }else{
                      iCurrentId--;
                      dPreNextElement = this.shadowRoot.querySelector("#month-"+ iCurrentId);
                  }
                }else if(this.bCalenderYearView){
                  if(iCurrentId === '1'){
                    this.iStartDecadeYear -= 10;
                    let iEndDeccadeYear = this.iStartDecadeYear + 10;
                    this.renderDecadeYears();
                    dMonthYearLabel.innerHTML = this.iStartDecadeYear + "-" + iEndDeccadeYear;
                    iCurrentId = 10;
                    dPreNextElement = this.shadowRoot.querySelector("#year-"+ iCurrentId);
                  }else{
                    iCurrentId--;
                    dPreNextElement = this.shadowRoot.querySelector("#year-"+ iCurrentId);
                  }

                }else{
                  if(dPreNextElement.value === '1' ){
                    dPreNextElement= this.moveToPrevMonthAndFoucsOnLastDate(dMonthYearLabel);
                  }else{
                    iCurrentId--;
                    dPreNextElement = this.shadowRoot.querySelector("#day-"+ iCurrentId);
                      if(dPreNextElement.disabled === true){
                        if(dPreNextElement.value === '1'){
                          dPreNextElement = this.moveToPrevMonthAndFoucsOnLastDate(dMonthYearLabel);
                        }else if(dPreNextElement.value === '2'){
                          dPreNextElement = this.moveToPrevMonthAndFoucsOnLastDate(dMonthYearLabel);
                        }else{
                          iCurrentId -= 2;
                          dPreNextElement = this.shadowRoot.querySelector("#day-"+ iCurrentId);
                      }
                  }}}
                 dPreNextElement.focus();
                    break;
                case "ArrowRight":
                  if(this.bCalenderMonthView){
                    if( iCurrentId  === '12'){
                      this.iYear++;
                      dMonthYearLabel.innerHTML = this.iYear;
                      iCurrentId = 1;
                      dPreNextElement = this.shadowRoot.querySelector("#month-"+ iCurrentId);
                      this.renderMonths();
                   }else{
                       iCurrentId++;
                       dPreNextElement = this.shadowRoot.querySelector("#month-"+ iCurrentId);
                       this.renderMonths();
                   }
                  }else if(this.bCalenderYearView){
                    if(iCurrentId === '10'){
                      this.iStartDecadeYear += 10;
                      let iEndDeccadeYear = this.iStartDecadeYear + 10;
                      dMonthYearLabel.innerHTML = this.iStartDecadeYear + "-" + iEndDeccadeYear ;
                      this.renderDecadeYears();
                      iCurrentId = 1;
                      dPreNextElement = this.shadowRoot.querySelector("#year-"+ iCurrentId);
                    }else{
                      iCurrentId++;
                      dPreNextElement = this.shadowRoot.querySelector("#year-"+ iCurrentId);
                    }
                  }else{
                    iCurrentId++;
                    dPreNextElement = this.shadowRoot.querySelector("#day-"+ iCurrentId);
                    if(dPreNextElement.disabled === true){
                      iCurrentId += 2;
                      dPreNextElement = this.shadowRoot.querySelector("#day-"+ iCurrentId);
                      if(dPreNextElement.value === ""){
                        dPreNextElement = this.moveToNextMonthAndFoucsOnFirstDate(dMonthYearLabel);
                      }}
                    }
                  dPreNextElement.focus();
                    break;
                }
             }});        
    }
  
     popluateDateElements(){
        let dCalenderContainer = this.shadowRoot.querySelector(".full-calender-container");
          for(let i = 1; i <= 42 ; i++){
            let dDivElement =  document.createElement("div");
            dDivElement.className = "day-of-week";
            let dDateButton =  document.createElement("button");
            dDateButton.id = "day-"+i;
            dDateButton.innerHTML = i;
            dDivElement.append(dDateButton);
            dCalenderContainer.append(dDivElement);
          }
     } 

    moveToNextMonth(dMonthYearLabel){
      if( this.iMonth< 12){
        this.iMonth++;
        dMonthYearLabel.innerHTML =  this.getMonthInString()+ "-" + this.iYear ;
       }else if (this.iMonth === 12){
          this.iYear++;
          this.iMonth= 1;
          dMonthYearLabel.innerHTML =  this.getMonthInString()+ "-" + this.iYear ;
       }
    } 
    moveToPrevMonth(dMonthYearLabel){
      if( this.iMonth> 1){
        this.iMonth--;
        dMonthYearLabel.innerHTML =  this.getMonthInString()+ "-" + this.iYear ;
     }else if (this.iMonth === 1){
        this.iYear--;
        this.iMonth= 12;
        dMonthYearLabel.innerHTML =  this.getMonthInString()+ "-" + this.iYear ;
       }
    }
     
    moveToPrevMonthAndFoucsOnLastDate(dMonthYearLabel){
      this.moveToPrevMonth(dMonthYearLabel);
      this.renderDate();
      let  dPreElement =  this.shadowRoot.querySelector("#day-"+ 42);
      for(let i = 42; i >= 1; i--){ 
        dPreElement =  this.shadowRoot.querySelector("#day-"+ i);
        if(dPreElement.disabled !== true){
          dPreElement =  this.shadowRoot.querySelector("#day-"+ i);
          break;
        }   } 
      return  dPreElement;
    }

    moveToNextMonthAndFoucsOnFirstDate(dMonthYearLabel){
      this.moveToNextMonth(dMonthYearLabel);
      this.renderDate();
      let  dNextElement =  this.shadowRoot.querySelector("#day-"+ 1);
      for(let i = 1; i <= 42; i++){ 
        dNextElement =  this.shadowRoot.querySelector("#day-"+ i);
        if(dNextElement.disabled !== true){
          dNextElement =  this.shadowRoot.querySelector("#day-"+ i);
          break;
        }   } 
      return  dNextElement;
    }

    getMonthInString(){
         if(this.iMonth === 1){ return "Jan"}
         else if(this.iMonth === 2){ return "Feb"}
         else if(this.iMonth === 3){ return "Mar"}
         else if(this.iMonth === 4){ return "Apr"}
         else if(this.iMonth === 5){ return "May"}
         else if(this.iMonth === 6){ return "Jun"}
         else if(this.iMonth === 7){ return "Jul"}
         else if(this.iMonth === 8){ return "Aug"}
         else if(this.iMonth === 9){ return "Sep"}
         else if(this.iMonth === 10){ return "Oct"}
         else if(this.iMonth === 11){ return "Nov"}
         else if(this.iMonth === 12){ return "Dec"}
    }

   getStartOfDecade(){
    const round = (n, to) => n - n % to;
    let startOfDecade = new Date(round(this.iYear, 10), 0, 1);
    let iStartDecadeYear = startOfDecade.getFullYear();
    return  iStartDecadeYear;
   }

   renderDecadeYears(){
    let dPreMonthButton = this.shadowRoot.querySelector('#prev-month')
    let dNextMonthButton = this.shadowRoot.querySelector('#next-month')
    dPreMonthButton.disabled = false;
    dNextMonthButton.disabled = false;
       for(let i = 1 ; i <= 10; i++){
         let dElementToChange = this.shadowRoot.querySelector('#year-' + i);
         dElementToChange.disabled = false;
         dElementToChange.innerHTML = this.iStartDecadeYear + i;
         dElementToChange.value = this.iStartDecadeYear + i;
         if(this.sForbiddenDateMin instanceof Date &&
          this.iStartDecadeYear + i < this.sForbiddenDateMin.getFullYear()){
              dElementToChange.disabled = true;
              dPreMonthButton.disabled = true;
          } 
          if(this.sForbiddenDateMax instanceof Date &&
            this.iStartDecadeYear + i > this.sForbiddenDateMax.getFullYear()){
                dElementToChange.disabled = true;
                dNextMonthButton.disabled = true;
            }
          if(i === this.iYear){
            dElementToChange.focus();
            }
        
        }
    }
    renderMonths(){
      let dPreMonthButton = this.shadowRoot.querySelector('#prev-month')
      let dNextMonthButton = this.shadowRoot.querySelector('#next-month')
      dPreMonthButton.disabled = false;
      dNextMonthButton.disabled = false;
      for(let i = 1; i <= 12 ; i++){
        let dElementToChange = this.shadowRoot.querySelector('#month-' +i);
        dElementToChange.value = i;
        dElementToChange.disabled = false;
      //disabling months on the month view if the month is inculded in the sForbiddenDateMin
        if(this.sForbiddenDateMin instanceof Date &&
          this.sForbiddenDateMin.getFullYear() === this.iYear && 
          // this.sForbiddenDateMin.getMonth() + 1 <= this.iMonth &&
          i < this.sForbiddenDateMin.getMonth() + 1){
            dElementToChange.disabled = true;
            dPreMonthButton.disabled = true;
        }
        if(this.sForbiddenDateMax instanceof Date &&
          this.sForbiddenDateMax.getFullYear() === this.iYear && 
          // this.sForbiddenDateMax.getMonth() + 1 >= this.iMonth &&
           i > this.sForbiddenDateMax.getMonth() + 1 ){
              dElementToChange.disabled = true;
              dNextMonthButton.disabled = true;
          }
        if(this.iMonth === i){
           dElementToChange.focus();
        }
      }
    }
    renderDate(){
      let sDate =  new Date(this.iYear,this.iMonth - 1, 1);
      let nowDate = new Date(this.getAttribute('') || Date.now());
      let iBeginingOfMonth = sDate.getDay();
      sDate =  new Date(this.iYear,this.iMonth  , 0); 
      //clear all the disabled buttons and date that is selected
      let dPreMonthButton = this.shadowRoot.querySelector('#prev-month')
      let dNextMonthButton = this.shadowRoot.querySelector('#next-month')
      dPreMonthButton.disabled = false;
      dNextMonthButton.disabled = false;
      for(let i = 1; i <= 42 ; i++){
        let dElementToChange = this.shadowRoot.querySelector('#day-' +i);
        dElementToChange.innerHTML = "";
        dElementToChange.setAttribute("value","");
        dElementToChange.removeAttribute("disabled");
        dElementToChange.setAttribute("class","day-of-week-button")
       }  
        let offset =  0;
         if(iBeginingOfMonth === 0){ offset =  0; }
         else if(iBeginingOfMonth === 1){offset =  1;}
         else if(iBeginingOfMonth === 2){offset =  2;}
         else if(iBeginingOfMonth === 3){offset =  3;}
         else if(iBeginingOfMonth === 4){offset =  4;}
         else if(iBeginingOfMonth === 5){offset =  5;}
         else if(iBeginingOfMonth === 6){offset =  6;} 
          
          for(let i = offset  + 1 ; i < sDate.getDate() + offset + 1 ; i++){
              let dElementToChange = this.shadowRoot.querySelector('#day-' + i   );
              dElementToChange.setAttribute("value",i - offset );
                dElementToChange.innerHTML = i - offset ;
                if(nowDate.getDate() === i - offset   && nowDate.getMonth()+ 1 === this.iMonth && nowDate.getFullYear() === this.iYear){
                 dElementToChange.setAttribute("class","current-day");
                //  dElementToChange.focus();
                 }  } 
                 
          for(let i = 1; i <= 42 ; i++){
          let dElementToChange = this.shadowRoot.querySelector('#day-' + i );
          let iDayOfElement =  dElementToChange.innerHTML;
          let iDateOfCurrentElement = new Date( this.iYear , this.iMonth - 1,  iDayOfElement );

          if(( this.getAttribute('weekEndsOn') === null || this.getAttribute('weekEndsOn') === "false") && 
             (iDateOfCurrentElement.getDay() === 0 || iDateOfCurrentElement.getDay() === 6)){
            dElementToChange.setAttribute("disabled","true");
          }
          if(this.sForbiddenDateMin !== null && iDateOfCurrentElement<= this.sForbiddenDateMin){
            dElementToChange.setAttribute("disabled","true");
          }else if(this.sForbiddenDateMax !== null && iDateOfCurrentElement>= this.sForbiddenDateMax  ){
            dElementToChange.setAttribute("disabled","true");
          }
          if( dElementToChange.innerHTML === ""){
            dElementToChange.setAttribute("value","");
            dElementToChange.setAttribute("disabled","true");
          }
          //updating the state of the current selected date
          if( this.sCurrentSelectedDate !== undefined && iDateOfCurrentElement.getTime() === this.sCurrentSelectedDate.getTime()){
              dElementToChange.setAttribute("class","current-date-selected");
              dElementToChange.focus();
          }
         }
         if(this.sForbiddenDateMin instanceof Date &&
          this.sForbiddenDateMin.getFullYear() === this.iYear && 
          this.sForbiddenDateMin.getMonth() + 1 >= this.iMonth ){
            dPreMonthButton.disabled = true;
           }
        if(this.sForbiddenDateMax instanceof Date &&
          this.sForbiddenDateMax.getFullYear() === this.iYear && 
          this.sForbiddenDateMax.getMonth() + 1 <= this.iMonth ){
            dNextMonthButton.disabled = true;
          }
}

    renderSelectedTypedDate(sPrevSelectedDate){
      this.sCurrentSelectedDate = new Date(sPrevSelectedDate);
       this.iMonth = this.sCurrentSelectedDate.getMonth() + 1;
       this.iYear = this.sCurrentSelectedDate.getFullYear();
       this.iDay = this.sCurrentSelectedDate.getDay(); 
       let dMonthYearLabel = this.shadowRoot.querySelector('.prev-and-next-label');
       dMonthYearLabel.innerHTML =  this.getMonthInString()+ "-" + this.iYear;
       this.renderDate();
    }

    checkMinMaxDate(){
      if( this.sForbiddenDateMin !== null && this.sForbiddenDateMin !== "undefined"){
        let datepart = this.sForbiddenDateMin.split("-");    
        if(datepart[1] === "days" || datepart[1] === "day"){
         let days = parseInt(datepart[0]) + 1;      
         if(days !== NaN){
          this.sForbiddenDateMin =  new Date(this.getAttribute('') || Date.now());
          this.sForbiddenDateMin.setDate( this.sForbiddenDateMin.getDate() - days);
         }
        }else if(datepart[1] === "month" || datepart[1] === "months"){
          let month = parseInt(datepart[0]);     
          if(month !== NaN){
            this.sForbiddenDateMin =  new Date(this.getAttribute('') || Date.now());
            this.sForbiddenDateMin.setMonth( this.sForbiddenDateMin.getMonth() - month);
           }
        }else{
          let bValidDate = this.validatedate(this.sForbiddenDateMin);
          bValidDate ? this.sForbiddenDateMin = new Date (this.sForbiddenDateMin) : this.sForbiddenDateMin = null;
        }
      }
      if(  this.sForbiddenDateMax !== null && this.sForbiddenDateMax !== "undefined"){
        let datepart = this.sForbiddenDateMax.split("-");   
       
        if(datepart[1] === "days" || datepart[1] === "day"){
         let days = parseInt(datepart[0]);      
          if(days !== NaN){
          this.sForbiddenDateMax = new Date(this.getAttribute('') || Date.now());
          this.sForbiddenDateMax.setDate(this.sForbiddenDateMax.getDate() + days);
            }
         }else if(datepart[1] === "month" || datepart[1] === "months"){
          let month = parseInt(datepart[0]);     
          if(month !== NaN){
            this.sForbiddenDateMax =  new Date(this.getAttribute('') || Date.now()); 
            this.sForbiddenDateMax.setMonth( this.sForbiddenDateMax.getMonth() + month);
           }
         }else{
         let bValidDate = this.validatedate(this.sForbiddenDateMax);
         bValidDate ? this.sForbiddenDateMax = new Date (this.sForbiddenDateMax ) : this.sForbiddenDateMax = null;
         }
    }
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
}

customElements.define("date-picker", DatePicker);