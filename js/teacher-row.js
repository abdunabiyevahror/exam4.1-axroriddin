 let cardRow = document.querySelector(".card__row");
 let teacherForm = document.querySelector(".teacher_form");
 let addBtn = document.querySelector(".add-teacher");
 let submitBtn = document.querySelector(".submit-button");
 let searchInput = document.querySelector("#search");
 let selectDropdown = document.querySelector("#select-1");
 let activePage = document.querySelector(".active");
 let orderFiltering = document.querySelector("#select-2");
 let teacherFormElements = teacherForm.elements;
 let search = "";
 let filterValue = null;
 let selected = null;
 let nameOrder = "";
 const LIMIT = 6;
 function getTeachers({
   avatar,
   firstName,
   email,
   phoneNumber,
   isMarried,
   id,
 }) {
   return `
    <div class="card">
            <div class="box">
                <video
                src="../"
                poster="${avatar}" 
                autoplay
                muted
                loop
                ></video>
            </div>
            <div class="box">
            <div class="content">
                <h1 class = "clamp">${firstName}, <span class="email">${email}</span></h1>
                <p class="phone"><span class="phone_title">TEL:</span> <span class="tell">${phoneNumber}</span></p>
                <ul>
                <li>
                    <div class="info-box">O"QUVCHILARI<span>62</span></div>
                </li>
                <li>
                    <div class="info-box">KASBI<span>120</span></div>
                </li>
                <li>
                    <div class="info-box">UYLANGANMI<span>${
                      isMarried ? "Merried" : "Single"
                    }</span></div>
                </li>
                </ul>
            </div>
       
    `;
 }

 function getTeachersData(filterValue) {
   const selectedOption = selectDropdown.value;
   filterValue =
     selectedOption === "false" ? false : selectedOption === "true" ? true : "";
   const queryParams = {
     firstName: search,
     sortBy: "firstName",
     order: nameOrder,
   };

   if (filterValue !== undefined) {
     queryParams.isMarried = filterValue;
   }

   axiosInstance
     .get("teacher", { params: queryParams })
     .then((response) => {
       let teachers = response.data;
       axiosInstance(`teacher?firstName=${search}`).then((res) => {
         pagination();
       });
       cardRow.innerHTML = "";
       teachers.map((el) => {
         cardRow.innerHTML += getTeachers(el);
       });
     })
     .catch((error) => {
       console.error(error);
     });
 }

 getTeachersData(filterValue);

 getTeachersData();

 selectDropdown.addEventListener("change", function () {
   let filterValue = selectDropdown.value;
   console.log(filterValue);
   axiosInstance
     .get(`/teacher`, {
       params: {
         isMarried:
           filterValue === "false" ? false : filterValue === "true" ? true : "",
       },
     })

     .then((response) => {
       const filteredStudents = response.data;
       cardRow.innerHTML = "";
       pagination();
       filteredStudents.map((el) => {
         cardRow.innerHTML += getTeachers(el);
       });
     })
     .catch((error) => {
       console.error(error);
     });
 });

 orderFiltering.addEventListener("change", function () {
   let filtering = orderFiltering.value;
   nameOrder = filtering === "asc" ? "asc" : filtering === "desc" ? "desc" : "";
   getTeachersData();
 });

 teacherForm.addEventListener("submit", function (e) {
   e.preventDefault();
   const firstName = teacherFormElements.firstName.value;
   const lastName = teacherFormElements.lastName.value;
   const avatar = teacherFormElements.avatar.value;
   const email = teacherFormElements.email.value;
   const group = teacherFormElements.group.value
     .split(",")
     .map((item) => item.trim().toLowerCase());
   const phoneNumber = teacherFormElements.phoneNumber.value;
   const isMarried = teacherFormElements.isMarried.checked;
   const phoneNumberRegex = /^\+\d{12}$/;
   const isValidPhoneNumber = phoneNumberRegex.test(phoneNumber);

   if (!isValidPhoneNumber) {
     alert("Invalid phone number");
     return;
   }
   let data = {
     firstName,
     avatar,
     lastName,
     email,
     phoneNumber,
     isMarried,
     group,
   };

   if (selected === null) {
     axiosInstance.post("teacher", data).then((res) => {
       closeModal();
       getTeachersData();
     });

     console.log(data);
   } else {
     axiosInstance.put(`teacher/${selected}`, data).then((res) => {
       closeModal();
       getTeachersData();
     });
   }
 });

 addBtn.addEventListener("click", function () {
   selected = null;
   submitBtn.innerHTML = "MUALLIM QO'SHISH";
   teacherForm.reset();
 });

 searchInput.addEventListener("keyup", function () {
   search = this.value;
   console.log(search);
   getTeachersData();
 });

 function pagination() {
   var items = $(".card__row .card");
   var numItems = items.length;
   var perPage = 6;

   items.slice(perPage).hide();

   $("#pagination-container").pagination({
     items: numItems,
     itemsOnPage: perPage,
     prevText: "&laquo;",
     nextText: "&raquo;",
     onPageClick: function (pageNumber) {
       var showFrom = perPage * (pageNumber - 1);
       var showTo = showFrom + perPage;
       items.hide().slice(showFrom, showTo).show();
     },
   });
 }

 const loading = document.getElementById("loading");
 window.addEventListener("load", () => {
   setTimeout(() => {
     loading.classList.add("loading-none");
   }, 8000);
 });