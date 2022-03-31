/*
todo:
1.login page- switch button
2.add loading
*/

const serverUrl = "https://sudoku-server-sooty.vercel.app";

window.onload = function () {
  // פונקציה שחותכת את השיר ברגע שמרעננים את האתר
  if (sessionStorage.getItem("user")) {
    document.getElementById("welcomeTitle").innerHTML = `Welcome ${
      JSON.parse(sessionStorage.getItem("user")).user.userName
    }`;
    document.getElementById("userBtn").remove();
  }
  document.getElementById("audio").currentTime = 13;
};

let playerEmptyInputs = []; // מערך שבו יהיה לוח המשחק כולל האינפוטים

let solvedBoard = []; // מערך שבו יהיה הלוח הפתור

let stopSolving = false; // finishו again בלחיצה על  solve יעצור את

let solved = false; // לבדוק אם בדקו את הפיתרון finishימנע מ

let clueCounter = 0; // סופר את מספר הרמזים שנלקחו

let timerInterval; // המשתנה הזה יוגדר לשנייה והוא ישומש לשינוי השעון כל שנייה

let firstGame = 4000;
// אם אני במשחק הראשון אני אוסיף דיליי של ארבע שניות
// עד שהאנימציה תסתיים ואז אתחיל את הטיימר

let levelForScore = 0; // משתנה שישמור את הרמה לצורך חישוב ניקוד

let playerScores = []; // משתנה שישמור את תוצאות השחקן

let filledAllInputs = false; // משתנה שישמור האם השחקן מילא את כל הריבועים

let userName = document.getElementById("userName");

let email = document.getElementById("email");

let password = document.getElementById("password");

const inputs = [userName, email, password];

let userNameDiv = document.getElementById("userDiv");

let passwordDiv = document.getElementById("passwordDiv");

let errorMessages = document.getElementsByClassName("error-message");

// לוח גיבוי שישומש במקרה שיצירת הלוח נתקעה

function playMusic() {
  // עובד על הפעלת ועצירת המוזיקה ועל האייקון של המוזיקה

  let audio = document.getElementById("audio");

  let musicSpan = document.getElementById("musicSpan");

  musicSpan.classList.toggle("start"); // מוסיף את סטארט אם אין אותו או מוחק אותו אם יש
  if (musicSpan.classList.contains("start")) {
    // אם לאייקון יש קלאס סטארט אז האייקון של הפעלה מופיע והמוזיקה צריכה לעצור
    audio.pause();
  } else {
    audio.play();
  }
}

function showLoginPage() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("login").style.display = "block";
}

function login() {
  while (errorMessages.length > 0) {
    // מעיף את הודעות השגיאה ממקודם כל פעם שמנסים להתחבר
    errorMessages[0].parentNode.removeChild(errorMessages[0]);
  }

  let loading = document.getElementById("loading");

  inputs.forEach((input) => input.classList.remove("is-invalid"));

  if (!userNameDiv.classList.contains("none")) {
    loading.style.visibility = "visible";
    axios
      .post(`${serverUrl}/users`, {
        userName: userName.value,
        email: email.value,
        password: password.value,
      })
      .then((res) => {
        if (res.data.user) {
          sessionStorage.setItem("user", JSON.stringify(res.data));
          document.getElementById("welcomeTitle").innerHTML = `Welcome ${
            JSON.parse(sessionStorage.getItem("user")).user.userName
          }`;
          document.getElementById("login").style.display = "none";
          document.getElementById("welcome").style.display = "block";
          document.getElementById("userBtn").remove();
        } else {
          Object.keys(res.data).forEach((error) =>
            error === "emailError"
              ? email.classList.add("is-invalid")
              : error === "passwordError"
              ? password.classList.add("is-invalid")
              : userName.classList.add("is-invalid")
          );
        }
        loading.style.visibility = "hidden";
      })
      .catch((err) => {
        console.log(err);
        loading.style.visibility = "hidden";
      });
  } else {
    loading.style.visibility = "visible";

    axios
      .post(`${serverUrl}/users/login`, {
        email: email.value,
        password: password.value,
      })
      .then((res) => {
        if (res.data.user) {
          sessionStorage.setItem("user", JSON.stringify(res.data));

          document.getElementById("welcomeTitle").innerHTML = `Welcome ${
            JSON.parse(sessionStorage.getItem("user")).user.userName
          }`;
          document.getElementById("login").style.display = "none";
          document.getElementById("welcome").style.display = "block";
          document.getElementById("userBtn").remove();
        }
        loading.style.visibility = "hidden";
      })
      .catch((err) => {
        const errorMessage = document.createElement("p");
        errorMessage.innerHTML = "Wrong credentials";
        errorMessage.classList.add("error-message");
        passwordDiv.appendChild(errorMessage);
        loading.style.visibility = "hidden";
      });
  }
}

function changeLoginPage() {
  while (errorMessages.length > 0) {
    // מעיף את הודעות השגיאה ממקודם כל פעם שמנסים להתחבר
    errorMessages[0].parentNode.removeChild(errorMessages[0]);
  }

  inputs.forEach((input) => input.classList.remove("is-invalid"));
  document.getElementById("loginForm").reset();
  userNameDiv.classList.toggle("none");
  let loginBtn = document.getElementById("loginBtn");
  let changeBtn = document.getElementById("changeBtn");
  [loginBtn.innerHTML, changeBtn.innerHTML] = [
    changeBtn.innerHTML,
    loginBtn.innerHTML,
  ];
}

function makeArrayFromMyCube(mat, row, col) {
  let arr = [];
  if (row >= 0 && row <= 2 && col >= 0 && col <= 2) {
    arr.push(mat[0][0]);
    arr.push(mat[0][1]);
    arr.push(mat[0][2]);
    arr.push(mat[1][0]);
    arr.push(mat[1][1]);
    arr.push(mat[1][2]);
    arr.push(mat[2][0]);
    arr.push(mat[2][1]);
    arr.push(mat[2][2]);
    // console.log("cube 1");
    return arr;
  }
  if (row >= 0 && row <= 2 && col >= 3 && col <= 5) {
    arr.push(mat[0][3]);
    arr.push(mat[0][4]);
    arr.push(mat[0][5]);
    arr.push(mat[1][3]);
    arr.push(mat[1][4]);
    arr.push(mat[1][5]);
    arr.push(mat[2][3]);
    arr.push(mat[2][4]);
    arr.push(mat[2][5]);
    // console.log("cube 2");
    return arr;
  }
  if (row >= 0 && row <= 2 && col >= 6 && col <= 8) {
    arr.push(mat[0][6]);
    arr.push(mat[0][7]);
    arr.push(mat[0][8]);
    arr.push(mat[1][6]);
    arr.push(mat[1][7]);
    arr.push(mat[1][8]);
    arr.push(mat[2][6]);
    arr.push(mat[2][7]);
    arr.push(mat[2][8]);
    // console.log("cube 3");
    return arr;
  }
  if (row >= 3 && row <= 5 && col >= 0 && col <= 2) {
    arr.push(mat[3][0]);
    arr.push(mat[3][1]);
    arr.push(mat[3][2]);
    arr.push(mat[4][0]);
    arr.push(mat[4][1]);
    arr.push(mat[4][2]);
    arr.push(mat[5][0]);
    arr.push(mat[5][1]);
    arr.push(mat[5][2]);
    // console.log("cube 4");
    return arr;
  }
  if (row >= 3 && row <= 5 && col >= 3 && col <= 5) {
    arr.push(mat[3][3]);
    arr.push(mat[3][4]);
    arr.push(mat[3][5]);
    arr.push(mat[4][3]);
    arr.push(mat[4][4]);
    arr.push(mat[4][5]);
    arr.push(mat[5][3]);
    arr.push(mat[5][4]);
    arr.push(mat[5][5]);
    // console.log("cube 5");
    return arr;
  }
  if (row >= 3 && row <= 5 && col >= 6 && col <= 8) {
    arr.push(mat[3][6]);
    arr.push(mat[3][7]);
    arr.push(mat[3][8]);
    arr.push(mat[4][6]);
    arr.push(mat[4][7]);
    arr.push(mat[4][8]);
    arr.push(mat[5][6]);
    arr.push(mat[5][7]);
    arr.push(mat[5][8]);
    // console.log("cube 6");
    return arr;
  }
  if (row >= 6 && row <= 8 && col >= 0 && col <= 2) {
    arr.push(mat[6][0]);
    arr.push(mat[6][1]);
    arr.push(mat[6][2]);
    arr.push(mat[7][0]);
    arr.push(mat[7][1]);
    arr.push(mat[7][2]);
    arr.push(mat[8][0]);
    arr.push(mat[8][1]);
    arr.push(mat[8][2]);
    // console.log("cube 7");
    return arr;
  }
  if (row >= 6 && row <= 8 && col >= 3 && col <= 5) {
    arr.push(mat[6][3]);
    arr.push(mat[6][4]);
    arr.push(mat[6][5]);
    arr.push(mat[7][3]);
    arr.push(mat[7][4]);
    arr.push(mat[7][5]);
    arr.push(mat[8][3]);
    arr.push(mat[8][4]);
    arr.push(mat[8][5]);
    // console.log("cube 8");
    return arr;
  }

  if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
    arr.push(mat[6][6]);
    arr.push(mat[6][7]);
    arr.push(mat[6][8]);
    arr.push(mat[7][6]);
    arr.push(mat[7][7]);
    arr.push(mat[7][8]);
    arr.push(mat[8][6]);
    arr.push(mat[8][7]);
    arr.push(mat[8][8]);
    // console.log("cube 9");
    return arr;
  }
}

function makeArrayFromMyCol(mat, col) {
  let arr = [];
  for (let i = 0; i < mat.length; i++) {
    let whatIsMyNumber = mat[i][col];
    arr.push(whatIsMyNumber);
  }
  return arr;
}

function generateInputs(sudoku, level) {
  let position; // המקום שעליו אני נמצא

  let positions = Array.from(Array(81).keys()); // ממספר את המקומות

  //  מספר הריצות יהיה 22, אם השחקן בחר רמה קשה
  // .הפונקציה תסמן 22 מספרים שצריכים להישאר בלוח
  // אם השחקן בחר רמה קלה הפונקציה תסמן 22 מספרים שיהפכו לאינפוטים

  let runs = 22;

  if (level === 40) {
    // אם המשתמש בחר רמה בינונית יסומנו ארבעים אינפוטים
    runs = 40;
  }

  for (let i = 0; i < runs; i++) {
    position = positions[Math.floor(Math.random() * positions.length)]; // בוחר מקום רנדומלי
    if (level === 59) {
      // אם אני ברמה קשה אני מסמן את המספר כדי שאוכל אחר כך לדעת שצריך להשאיר אותו
      sudoku[position] *= 10;
    } else {
      // אם אני ברמה קלה או בינונית אני מאפס את המספר כדי שאדע להפוך אותו לאינפוט

      sudoku[position] = 0;
    }

    // מוציא את המיקום הנוכחי ממערך המיקומים כדי שלא אצא שוב על אותה משבצת בהמשך

    positions = positions.filter((j) => j !== position);
  }

  return sudoku;
}

function createTable(sudoku, level) {
  let table = document.createElement("table");

  table.setAttribute("id", "table");

  let borderStyle = "5px solid #272727"; // עיצוב של הקוביות

  for (let i = 0; i < sudoku.length; i++) {
    let tr = table.insertRow(); // יוצר שורה

    for (let j = 0; j < sudoku[i].length; j++) {
      let td = tr.insertCell(); // יוצר תא
      td.classList.add("td");

      // אם אני ברמה קשה אני בודק האם המספר גדול מתשע
      // אם הוא גדול מתשע אני מחלק אותו בעשר ומחזיר אותו למצב המקורי שלו
      // אחרת, אם הוא קטן מעשר אני מאפס אותו

      if (level === 59) {
        if (sudoku[i][j] > 9) {
          sudoku[i][j] /= 10;
        } else {
          sudoku[i][j] = 0;
        }
      }

      // עיצוב של הקוביות, אני בודק איפה המשבצת נמצאת בטבלה ולפי המיקום אני מוסיף מסגרת

      if (i == 0) {
        td.style.borderTop = borderStyle;
      } else if (i == 8 || i == 2 || i == 5) {
        td.style.borderBottom = borderStyle;
      }

      if (j == 0) {
        td.style.borderLeft = borderStyle;
      } else if (j == 8 || j == 2 || j == 5) {
        td.style.borderRight = borderStyle;
      }

      // יצירת הטבלה

      if (sudoku[i][j] > 0) {
        // אם המספר גדול מאפס הוא צריך להישאר ולכן אני מכניס אותו לתא

        td.appendChild(document.createTextNode(sudoku[i][j]));
      } else {
        // אם המספר שווה אפס אני יוצר אינפוט ומכניס אותו לתא

        let input = document.createElement("input");
        // attributes לכל אינפוט אני שומר את השורה והטור בתור
        input.setAttribute("type", "number");
        input.setAttribute("min", "1");
        input.setAttribute("row", i);
        input.setAttribute("col", j);

        input.classList.add("input");

        input.addEventListener("keydown", (event) => {
          // בודק בכל הקשה על המקלדת האם התו נמצא בין 1-9
          let value = event.key;
          if ("123456789".indexOf(value) == -1) {
            // אם התו לא נמצא בין 1-9 אני מונע מהאינפוט להכניס את התו
            event.preventDefault();
          } else {
            // אם התו נמצא בין 1-9 אני מכניס רק את הספרה האחרונה שהוכנסה
            input.value = value.slice(1);
          }
        });

        // מכניס את האינפוט לתא
        td.appendChild(input);
      }
    }
  }
  // מחזיר את הטבלה
  return table;
}

function createSudoku() {
  let mat = [];

  // create the first row by randomize rowOptions

  let rowOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  mat.push(rowOptions.sort(() => Math.random() - 0.5));

  // slice the first line to three parts

  let rowSlices = [mat[0].slice(0, 3), mat[0].slice(3, 6), mat[0].slice(6, 9)];

  // create the second and third lines by changing positions of the slices

  mat.push(rowSlices[2].slice()); // create new line

  // push the rest of the numbers to the second line

  mat[1].push(...rowSlices[0]);

  mat[1].push(...rowSlices[1]);

  // same for line three

  mat.push(rowSlices[1].slice());
  mat[2].push(...rowSlices[2]);
  mat[2].push(...rowSlices[0]);

  // add the last lines with addLines

  mat = addLines(mat);

  // shuffe the final mat for the last time

  mat = shuffleBoard(mat);

  return mat;
}

function addLines(mat) {
  let firstCol, secondCol, thirdCol;

  for (let i = 0; i < 3; i++) {
    // shuffel the columns in each line to create another three rows

    [firstCol, secondCol, thirdCol] = [mat[i][2], mat[i][0], mat[i][1]];

    mat.push([firstCol, secondCol, thirdCol]); // create new line

    [firstCol, secondCol, thirdCol] = [mat[i][5], mat[i][3], mat[i][4]];

    // add numbers to the line

    mat[i + 3].push(...[firstCol, secondCol, thirdCol]);

    [firstCol, secondCol, thirdCol] = [mat[i][8], mat[i][6], mat[i][7]];

    mat[i + 3].push(...[firstCol, secondCol, thirdCol]);
  }

  for (let j = 0; j < 3; j++) {
    // shuffel the columns in each line to create the last three rows

    [firstCol, secondCol, thirdCol] = [mat[j][1], mat[j][2], mat[j][0]];

    mat.push([firstCol, secondCol, thirdCol]); // create new line

    [firstCol, secondCol, thirdCol] = [mat[j][4], mat[j][5], mat[j][3]];

    // add numbers to the line

    mat[j + 6].push(...[firstCol, secondCol, thirdCol]);

    [firstCol, secondCol, thirdCol] = [mat[j][7], mat[j][8], mat[j][6]];

    mat[j + 6].push(...[firstCol, secondCol, thirdCol]);
  }
  return mat;
}

function shuffleBoard(mat) {
  // slicing the mat and creating variations with shuffle
  // choosing variation from each slice and than shuffeling the mat by columns

  let firstVariations = shuffle(mat.slice(0, 3));
  let secondVariations = shuffle(mat.slice(3, 6));
  let thirdVariations = shuffle(mat.slice(6, 9));
  let arr = [...firstVariations, ...secondVariations, ...thirdVariations];
  let sudokuBoard = [
    ...arr[Math.floor(Math.random() * 5)],
    ...arr[Math.floor(Math.random() * 5) + 6],
    ...arr[Math.floor(Math.random() * 5) + 12],
  ];
  let moveColumnsOptions = [0, 3, 6];
  let randomMovingColumnsNumber =
    moveColumnsOptions[Math.floor(Math.random() * 3)];

  for (let i = 0; i < randomMovingColumnsNumber; i++) {
    sudokuBoard.forEach((x) => x.unshift(x.pop()));
  }

  let columnsShuffleOptions = [
    [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)],
    [Math.floor(Math.random() * 2) + 3, Math.floor(Math.random() * 2) + 3],
    [Math.floor(Math.random() * 2) + 6, Math.floor(Math.random() * 2) + 6],
  ];

  columnsShuffleOptions = columnsShuffleOptions.filter(
    (option) => option[0] !== option[1]
  );

  sudokuBoard.forEach((x) => {
    for (let i = 0; i < columnsShuffleOptions.length; i++) {
      [x[columnsShuffleOptions[i][0]], x[columnsShuffleOptions[i][1]]] = [
        x[columnsShuffleOptions[i][1]],
        x[columnsShuffleOptions[i][0]],
      ];
    }
  });
  return sudokuBoard;
}

function shuffle(sudoku) {
  // יוצרת את כל הוריאציות האפשריות מכל חלק בסודוקו

  let line1 = sudoku[0];
  let line2 = sudoku[1];
  let line3 = sudoku[2];
  let sudoku2 = [line3, line2, line1];
  let sudoku3 = [line3, line1, line2];
  let sudoku4 = [line2, line3, line1];
  let sudoku5 = [line2, line1, line3];
  let sudoku6 = [line1, line3, line2];
  return [sudoku, sudoku2, sudoku3, sudoku4, sudoku5, sudoku6];
}

function showSudoku(level) {
  if (level == 22) {
    levelForScore = 1;
  } else if (level == 40) {
    levelForScore = 2;
  } else {
    levelForScore = 3;
  }

  playerEmptyInputs = []; // מערך שבו יהיה לוח המשחק כולל האינפוטים
  let sudokuBoard; // לכאן ייכנס המערך מהפונקציה היוצרת או מפונקציית הגיבוי

  sudokuBoard = createSudoku(); // יצירת הלוח
  createSudokuRun = 0; // מאפס את ספירת ריצות הפונקציה כדי למנוע בעיות במשחק הבא

  solvedBoard = sudokuBoard.slice(); // שמירה של פיתרון הלוח

  let flatSudoku = sudokuBoard.slice().flat(); // שיטוח של הלוח בשביל להכניס לתוכו אינפוטים

  flatSudoku = generateInputs(flatSudoku, level); // יצירת הלוח עם האינפוטים

  for (let i = 0; i < flatSudoku.length; i += 9) {
    // playerEmptyInputsהפיכת המערך בחזרה למטריצה ושמירתו ב

    playerEmptyInputs.push(flatSudoku.slice(i, i + 9));
  }

  let table = createTable(playerEmptyInputs, level); // יצירת טבלה בעזרת הפונקציה

  // הכנסת הטבלה לפני הדיב של הכפתורים

  let actions = document.getElementById("gameActions");
  let gameDiv = document.getElementById("game-page");

  gameDiv.insertBefore(table, actions);

  // welcome הצגת דף המשחק במקום דף

  //  מחזירים את כפתור הרמז כי יכול להיות שבמשחק הקודם העלמנו אותו

  if (document.getElementById("clueBtn").style.display == "none") {
    document.getElementById("clueBtn").style.display = "inline";
  }

  document.getElementById("welcome").style.display = "none";
  document.getElementById("game").style.display = "block";

  // רק אם אני במשחק הראשון אני מפעיל את המוזיקה, אם לא היא תופעל על ידי הכפתור
  if (firstGame > 0) {
    playMusic();
  }

  // יוצר את הטיימר, במשחק הראשון יהיה דיליי בגלל האנימציה
  // בודק אם הרוחב של המסך קטן שווה ל768 מפני שאם אנחנו במסך של טלפון
  // אנחנו לא מראים את האנימציה ולכן לא צריך דיליי
  startInterval();
}

function finish() {
  // אם האנימציה התחילה ולחצו על פיניש לפני שהיא נגמרה התמונה לא תיעלם
  // ובמשחק הבא האנימציה תרוץ שוב, לכן אנחנו מעלימים את התמונה בלחיצה על פיניש

  stopSolving = true; // solve עוצר את פונקציית

  if (solved == false) {
    // אני בודק את הלוח solve רק אם לא לחצו על

    let inputs = Array.from(document.getElementsByClassName("input")); // מביא את כל האינפוטים

    inputs = inputs.filter((x) => x.disabled !== true);

    if (inputs.filter((input) => input.value !== "").length < inputs.length) {
      // מסנן את כל הערכים הריקים
      // בודק אם האורך של המערך המסונן קטן מהאורך של המערך הרגיל
      // אם כן אני עוצר את הבדיקה ומחזיר את המודל עם הודעה שלא מילאו את כל האינפוטים
      filledAllInputs = false;
      showModal(false);
    } else {
      filledAllInputs = true;
      let time = stopTimer(); // עוצר את הטיימר ומחזיר את הזמן

      let seconds =
        Number(time[0]) * 3600 + Number(time[1]) * 60 + Number(time[2]); // סך השניות

      for (let i = 0; i < inputs.length; i++) {
        // מכניס ללוח של השחקן את האינפוטים לפי המקום שבהם הוכנסו ערכים
        let row = inputs[i].getAttribute("row");

        let col = inputs[i].getAttribute("col");

        playerEmptyInputs[row][col] = Number(inputs[i].value);
      }

      // סופרים את הטעויות, הבדיקה שנעשתה בודקת האם המיקום של
      // ההופעה הראשונה של המספר שונה מההופעה האחרונה ואם כן הוא מופיע יותר מפעם אחת

      let mistakes = 0;

      for (let j = 0; j < inputs.length; j++) {
        let row = inputs[j].getAttribute("row");

        let col = inputs[j].getAttribute("col");

        let currentInput = playerEmptyInputs[row][col];

        if (
          playerEmptyInputs[row].indexOf(currentInput) !==
          playerEmptyInputs[row].lastIndexOf(currentInput)
        ) {
          mistakes += 1;
          continue;
        }
        let inputCol = makeArrayFromMyCol(playerEmptyInputs, col);
        if (
          inputCol.indexOf(currentInput) !== inputCol.lastIndexOf(currentInput)
        ) {
          mistakes += 1;
          continue;
        }
        let inputCube = makeArrayFromMyCube(playerEmptyInputs, row, col);
        if (
          inputCube.indexOf(currentInput) !==
          inputCube.lastIndexOf(currentInput)
        ) {
          mistakes += 1;
        }
      }

      // מחשבים את הניקוד עם פונקציה נפרדת

      let score = finalScore(seconds, mistakes);

      if (sessionStorage.getItem("user")) {
        axios
          .post(`${serverUrl}/users/finish`, {
            userScore: {
              userId: JSON.parse(sessionStorage.getItem("user")).user.id,
              score,
              mistakes,
              clues: clueCounter,
              time: time.join(":"),
              userName: JSON.parse(sessionStorage.getItem("user")).user
                .userName,
            },
          })
          .then((res) => {
            showModal(
              res.data,
              mistakes > 0 ? false : true,
              mistakes,
              score,
              time.join(""),
              clueCounter
            );
          })
          .catch((err) => console.log(err));
      } else {
        showModal(
          [],
          mistakes > 0 ? false : true,
          mistakes,
          score,
          time.join(""),
          clueCounter
        );
      }

      // מעבירים למודל האם ניצח,כמה טעויות,ניקוד,זמן ומספר הרמזים

      clueCounter = 0; // מאפסים את הרמזים
      document.getElementById("cluesNumber").innerHTML = 3; // מחזיר את הספאן להיות שלוש
    }
  } else {
    // מוחק את הטבלה ועובר לבחירת הרמה כדי שבפעם הבאה
    // שיתחילו משחק לא יהיו שתי טבלאות
    removeGame();
  }
  solved = false; // לפולס כדי שבמשחק הבא תתבצע בדיקה solved הופך את
}

function finalScore(seconds, mistakes) {
  // כל הטעויות והרמזים יוסיפו שניות לזמן המשחק והחישוב ייעשה לפי הזמן הכולל

  let level = levelForScore;
  let hint = clueCounter;
  let timeBonus = 0;
  let maxScore = 3000 * level;
  let avrgTime = 0;
  switch (level) {
    case 1:
      seconds += mistakes * 30;
      avrgTime = 240;
      break;
    case 2:
      seconds += mistakes * 37;
      avrgTime = 600;
      break;
    case 3:
      seconds += mistakes * 41;
      avrgTime = 1500;
      break;
  }

  // let hintBonus = 300 - hint * 100;

  // יוסיף נקודות למקס אם הזמן הכולל קטן מהזמן הממוצע ויוריד נקודות אם הוא גדול timeBonus

  timeBonus = (avrgTime - seconds - hint * 30) * (level * 10);

  let finalCalculate = maxScore + timeBonus;
  if (finalCalculate < 200) {
    finalCalculate = 200;
  }
  // console.log(finalCalculate);
  return finalCalculate;
}

function solve() {
  // הפונקציה תרוץ כל 75 מיליסקנדס בשביל ליצור אנימציה נחמדה של פיתרון
  // בתוך לולאה שרצה על כל האינפוטים בשביל ליצור את האנימציה setTimeoutאנחנו משתמשים ב

  stopTimer(); // עוצרים את השעון
  clueCounter = 0; // מאפסים את הרמזים
  stopSolving = false; // מאפשר לפונקציה לרוץ אם עצרו אותה במקום אחר

  let inputs = document.getElementsByClassName("input");

  for (let i = 0; i < inputs.length; i++) {
    updateInput(i);
  }

  function updateInput(i) {
    setTimeout(function () {
      if (stopSolving === true) {
        // הפונקציה תיעצר אם לחצו על פיניש או על אגיין
        return;
      }
      // הפונקציה הולכת ללוח הפתור במקומות של האינפוטים ומביאה את הערכים משם

      let row = inputs[i].getAttribute("row");

      let col = inputs[i].getAttribute("col");

      inputs[i].value = solvedBoard[row][col];
    }, 75 * i);
  }

  // finish מצהיר שהפעילו את הפונקציה כדי שאם ילחצו על
  // לא תבדוק את הלוח finish הפונקציה של
  solved = true;
}

function again() {
  // פונקציה שעוברת על כל האינפוטים והופכת כל אחד מהם לסטרינג ריק

  clueCounter = 0; // מאפס את הרמזים

  document.getElementById("cluesNumber").innerHTML = 3; // מחזיר את הספאן להיות שלוש

  document.getElementById("clueBtn").style.display = "inline"; // מחזיר את הכפתור

  stopSolving = true; // solve עוצר את פונקציית

  let inputs = Array.from(document.getElementsByClassName("input"));

  inputs.forEach((input) => {
    // כשאנחנו יוצרים רמז אנחנו מוסיפים קלאס רמז בשביל לתת לו עיצוב של רמז
    // כאשר מתחילים מחדש אנחנו מוחקים את העיצוב של הרמז בשביל שהלוח יהיה רגיל

    if (input.classList.contains("clue")) {
      input.classList.remove("clue");
      input.disabled = false;
      // console.log(input);
    }
    input.value = "";
  });

  // עוצר את השעון ומתחיל אותו מחדש

  stopTimer();
  startInterval();
  solved = false; // מאפשר לבדוק כי המשתמש התחיל מהתחלה
}

function clue() {
  if (clueCounter < 3) {
    // רק אם השתמשו בפחות מ4 רמזים אני נותן רמז
    // למשתמש לא אמורה להיות אפשרות להשתמש ביותר משלושה רמזים
    // אלא אם הוא יתעסק עם האתר וינסה להחזיר את הכפתור אז הוספנו תנאי לכל מקרה
    // מביא את כל האינפוטים

    let inputs = Array.from(document.getElementsByClassName("input"));

    // מערך של אינפוטים ריקים

    let emptyInputs = inputs.filter((input) => input.value === "");
    if (emptyInputs.length > 0) {
      // אם הלוח מלא אין מה לתת רמז
      // מגדיל את הספירה של הרמזים

      clueCounter++;
      // בוחר אינפוט רנדומלי

      let pickedInput =
        emptyInputs[Math.floor(Math.random() * emptyInputs.length)];

      // מכניס לאינפוט את הערך במקום של האינפוט במערך הפתור

      let row = pickedInput.getAttribute("row");

      let col = pickedInput.getAttribute("col");

      // מוסיף לרמז עיצוב של רמז

      pickedInput.setAttribute("disabled", "true");

      pickedInput.value = solvedBoard[row][col];

      pickedInput.classList.add("clue");

      document.getElementById("cluesNumber").innerHTML = 3 - clueCounter; // מעדכן את הספאן
      // ספרייה שמייצרת הודעה קופצת שמודיעה כמה רמזים נשארו
      // בשביל להשתמש בספרייה htmlהוספנו סקריפט ב
      Toastify({
        text: `${
          clueCounter == 3
            ? `You don't have any clues left!`
            : clueCounter == 2
            ? "You have one clue left!"
            : "You have two clues left!"
        }`,
        className: "toast",
        position: "left",
        offset: {
          // מיקום של ההודעה על המסך
          x: "100",
          y: "100",
        },
        duration: 3000,
        close: true,
        style: {
          background: "#a52a3e",
        },
        stopOnFocus: true,
      }).showToast();
    }
  }
  if (clueCounter == 3) {
    // אם השתמשו ב3 רמזים אני מעלים את הכפתור

    document.getElementById("clueBtn").style.display = "none";
  }
}

function showModal(
  scoreBoard,
  win,
  mistakes = 0,
  score = 0,
  time = 0,
  clues = 0
) {
  // מציג את המודל

  setContentOfModal(scoreBoard, win, mistakes, score, time, clues); // פונקציה שתכניס פרטים למודל

  // מראה את המודל

  document.getElementById("backdrop").style.display = "inline";

  document.getElementById("modalOverlay").style.display = "inline";

  document.getElementById("modal").style.opacity = 1;
}

function removeGame() {
  // פונקציה שמוחקת את הלוח ומעבירה לדף בחירת הרמה

  document.getElementById("table").remove();
  document.getElementById("game").style.display = "none";
  document.getElementById("welcome").style.display = "block";
}

function closeModal(finishGame = true) {
  // פונקציה שמאפסת וסוגרת את המודל
  // אם השחקן סיים את המשחק או שהוא לא מילא את כל האינפוטים אבל ביקש
  // להתחיל משחק חדש אנחנו מעלימים את המשחק,עוצרים את השעון ומאפסים את הרמזים
  // אם הוא לא מילא את כל האינפוטים, לחץ על פיניש וביקש להמשיך אנחנו רק סוגרים את המודל

  if (finishGame) {
    stopTimer();
    clueCounter = 0;
    document.getElementById("cluesNumber").innerHTML = 3; // מחזיר את הספאן להיות שלוש
    removeGame();
  }
  document.getElementById("backdrop").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
  document.getElementById("modal").style.opacity = 0;
}

function setContentOfModal(scoreBoard, win, mistakes, score, time, clues) {
  // פונקציה שתכניס תוכן למודל
  let userId;

  if (JSON.parse(sessionStorage.getItem("user"))) {
    userId = JSON.parse(sessionStorage.getItem("user")).user.id;
  }

  let content = document.getElementById("content");
  while (content.childElementCount > 0) {
    // מוחק את התוכן מהפעם הקודמת

    content.removeChild(content.children[0]);
  }

  let title = document.createElement("h1");

  // יהיה פולס והטעויות יהיו אפס במקרה שהשחקן לא מילא את כל האינפוטים winיכול להיות ש
  // במקרה כזה אנחנו נראה הודעת אזהרה

  if (win == false && mistakes > 0) {
    title.innerHTML = "You Lose";
  } else if (win == true) {
    title.innerHTML = "You Win";
  }
  content.appendChild(title);

  if ((mistakes > 0 && win == false) || win == true) {
    // יוצרים את טבלת הניקוד

    if (scoreBoard.length > 0) {
      let table = document.createElement("table");
      table.classList.add("table");
      let header = table.createTHead();
      header.classList.add("table-header");
      let headerRow = header.insertRow();
      let headerCell1 = headerRow.insertCell();
      let headerCell2 = headerRow.insertCell();
      let headerCell3 = headerRow.insertCell();
      let headerCell4 = headerRow.insertCell();
      let headerCell5 = headerRow.insertCell();

      headerCell1.innerHTML = "Name";
      headerCell2.innerHTML = "Time";
      headerCell3.innerHTML = "Clues";
      headerCell4.innerHTML = "Mistakes";
      headerCell5.innerHTML = "Score";

      for (let i = 0; i < scoreBoard.length; i++) {
        // עובר על מערך תוצאות המשחקים

        let row = table.insertRow();
        if (scoreBoard[i].score.userId === userId) {
          // אם אנחנו נמצאים על המשחק הנוכחי אנחנו מסמנים אותו

          row.classList.add("current-game");

          // משנה אותו לפולס כדי שבפעם הבאה לא יהיו שני משחקים נוכחים
        } else {
          row.classList.add("all-games");
        }
        let cell1 = row.insertCell();
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        let cell4 = row.insertCell();
        let cell5 = row.insertCell();

        cell1.innerHTML = scoreBoard[i].score.userName;
        cell2.innerHTML = scoreBoard[i].score.time;
        cell3.innerHTML = scoreBoard[i].score.clues;
        cell4.innerHTML = scoreBoard[i].score.mistakes;
        cell5.innerHTML = scoreBoard[i].score.score;
      }
      content.appendChild(table);
    } else {
      let stats = document.createElement("p");
      stats.innerHTML = `score : ${score}`;
      content.appendChild(stats);
    }
  } else {
    // אם המשתמש לא מילא הכל אנחנו יוצרים הודעת אזהרה עם כפתורים המאפשרים
    // להמשיך או להתחיל משחק חדש

    let didntCompleteMessage = document.createElement("p");
    didntCompleteMessage.classList.add("didnt-complete");
    didntCompleteMessage.innerHTML = `You didn't complete all the fields. 
    Are you sure you want to finish the game? `;
    let continuePlayingButton = document.createElement("button");
    let stopPlayingButton = document.createElement("button");
    continuePlayingButton.classList.add("btn");
    continuePlayingButton.classList.add("button");
    continuePlayingButton.classList.add("continue-btn");
    stopPlayingButton.classList.add("btn");
    stopPlayingButton.classList.add("button");
    continuePlayingButton.innerHTML = "Continue";
    stopPlayingButton.innerHTML = "New Game";
    continuePlayingButton.addEventListener("click", () => closeModal(false));
    stopPlayingButton.addEventListener("click", () => closeModal());
    let modalActions = document.createElement("div");
    modalActions.classList.add("modal-actions");
    modalActions.appendChild(continuePlayingButton);
    modalActions.appendChild(stopPlayingButton);
    content.appendChild(didntCompleteMessage);
    content.appendChild(modalActions);
  }
}

function startTimer(timer) {
  // היא פונקציה שמפרקת סטרינג לחלקים במערך כל פעם שמופיע תו מסוים split
  // מפרק את הסטרינג של השעון למערך של שלושה חלקים (שעות, דקות, שניות)

  let hours = Number(timer.innerHTML.split(":")[0]);
  let minutes = Number(timer.innerHTML.split(":")[1]);
  let seconds = Number(timer.innerHTML.split(":")[2]);

  if (minutes == 59 && seconds == 59) {
    hours += 1;
    minutes = 0;
    seconds = 0;
  } else if (seconds == 59) {
    minutes += 1;
    seconds = 0;
  } else {
    seconds += 1;
  }

  // היא פונקציה שמוסיפה תו מסוים עד שהיא מגיעה לאורך המבוקש padStart
  // במקרה שלנו מוסיפה אפסים עד שהאורך של כל חלק יהיה 2

  timer.innerHTML =
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}

function startInterval() {
  // היא פונקציה שרצה באופן קבוע כל זמן מסוים,במקרה שלנו כל שנייה setInterval
  // את השעון ורץ כל שנייה startTimerמעביר ל

  let timer = document.getElementById("timer");
  timerInterval = setInterval(() => startTimer(timer), 1000);
}

function stopTimer() {
  let timer = document.getElementById("timer");
  let time = timer.innerHTML.split(":"); // שומר את השעות,דקות ושניות
  timer.innerHTML = "00:00:00"; // מאפס את השעון
  clearInterval(timerInterval); // עוצר את האינטרבל כדי שהשעון יפסיק לרוץ
  timerInterval = undefined;
  return time; // מחזיר את הזמן לפונקציה של הבדיקה
}

document.getElementById("userBtn").addEventListener("click", showLoginPage);

document.getElementById("loginBtn").addEventListener("click", login);

document.getElementById("changeBtn").addEventListener("click", changeLoginPage);

document
  .getElementById("easyBtn")
  .addEventListener("click", () => showSudoku(22));

document
  .getElementById("mediumBtn")
  .addEventListener("click", () => showSudoku(40));

document
  .getElementById("hardBtn")
  .addEventListener("click", () => showSudoku(59));

document.getElementById("finishBtn").addEventListener("click", finish);
document.getElementById("againBtn").addEventListener("click", again);

document.getElementById("solveBtn").addEventListener("click", solve);
document.getElementById("clueBtn").addEventListener("click", clue);

document
  .getElementById("close")
  .addEventListener("click", () => closeModal(filledAllInputs));
