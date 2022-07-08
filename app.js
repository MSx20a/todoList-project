let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  //這裡的e指的是buttom
  //避免按下button後form送出
  e.preventDefault();
  //取得輸入後的值
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDay = form.children[2].value;

  if (todoText == "") {
    alert("請輸入代辦事項");
    //使用return使其不要繼續執行以下的callback function
    return;
  } else if (todoMonth == "" || todoDay == "") {
    alert("請輸入正確日期");
    return;
  }

  let todo = document.createElement("div");
  todo.classList.add("todo");
  let x = todo.classList.contains("done");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + "/" + todoDay;
  todo.appendChild(text);
  todo.appendChild(time);
  section.appendChild(todo);

  //把輸入框內的內容及日期清空
  form.children[0].value = "";
  form.children[1].value = "";
  form.children[2].value = "";

  let complateButton = document.createElement("button");
  complateButton.classList.add("complate");
  complateButton.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
  complateButton.addEventListener("click", (e) => {
    let complateItem = e.target.parentElement;
    //toggle會判斷當前所選擇的element內如果有該輸入的class就會移除，反之就會新增；因此可以達成如不小心刪掉代辦事項又可以在還原的功能
    complateItem.classList.toggle("done");
    let x = todo.classList.contains("done");
    return x;
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  trashButton.addEventListener("click", (e) => {
    let trashItem = e.target.parentElement;
    trashItem.style.animation = "scaleDown 0.5s forwards";
    //新增一個event用來設定動畫結束後執行移除便簽，如果不新增此event直接remove會造成動畫還沒跑完便簽就被移除
    trashItem.addEventListener("animationend", () => {
      let text = trashItem.children[0].innerText;
      let myList = localStorage.getItem("list");
      let myListArray = JSON.parse(myList);
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
        }
      });
      trashItem.remove();
    });
  });
  todo.appendChild(complateButton);
  todo.appendChild(trashButton);

  //設定新增便簽時的動畫
  todo.style.animation = "scaleUp 0.5s forwards";

  //新增一個object為myTodo
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDay: todoDay,
    done: x,
  };

  //把剛剛創建好的myTodo存入localStorage
  let myList = localStorage.getItem("list");
  //當localStorage裡沒有任何東西時console會得到null
  if (myList == null) {
    //這裡把存進去的myTodo用[]框起來，那到時再用array取出來就是完整的一個項
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  console.log(JSON.parse(localStorage.getItem("list")));
});

loadDate();

//loadDate用來重新開起頁面時把localStorage顯示出來
function loadDate() {
  let myList = localStorage.getItem("list");
  if (myList != null) {
    let myListArray = JSON.parse(myList);
    //這邊使用forEach把array內的每筆資料都抓出來處理
    myListArray.forEach((item) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + "/" + item.todoDay;
      todo.appendChild(text);
      todo.appendChild(time);

      let complateButton = document.createElement("button");
      complateButton.classList.add("complate");
      complateButton.innerHTML =
        '<i class="fa fa-check" aria-hidden="true"></i>';
      complateButton.addEventListener("click", (e) => {
        let complateItem = e.target.parentElement;
        //toggle會判斷當前所選擇的element內如果有該輸入的class就會移除，反之就會新增；因此可以達成如不小心刪掉代辦事項又可以在還原的功能
        complateItem.classList.toggle("done");
      });
      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
      trashButton.addEventListener("click", (e) => {
        let trashItem = e.target.parentElement;
        trashItem.style.animation = "scaleDown 0.5s forwards";
        //新增一個event用來設定動畫結束後執行移除便簽，如果不新增此event直接remove會造成動畫還沒跑完便簽就被移除
        trashItem.addEventListener("animationend", () => {
          //trashItem目前是在<div>因此他的children有<p class:todo-text>,<p class:todo-time>,<complateButton>,<trashButton>共4個
          let text = trashItem.children[0].innerText;
          let myList = localStorage.getItem("list");
          let myListArray = JSON.parse(myList);
          //此forEach用來設定刪除的標籤功能
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              //splice是用於array內要刪除指定的[項]，裡面第一個index代表起始項,後面的值代表要移除多少個
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          trashItem.remove();
        });
      });
      todo.appendChild(complateButton);
      todo.appendChild(trashButton);

      section.appendChild(todo);
    });
  }
}

//Merge Sort排序演算法
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDay) > Number(arr2[j].todoDay)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

function mergeSort(arr) {
  if (arr.length == 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}
//console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

let sortButtom = document.querySelector("div.sort button");
sortButtom.addEventListener("click", () => {
  let sortArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortArray));

  //移除section內的資料
  let sectionLen = section.children.length;
  for (let i = 0; i < sectionLen; i++) {
    section.children[0].remove();
    console.log(section.children[0]);
  }

  loadDate();
});
