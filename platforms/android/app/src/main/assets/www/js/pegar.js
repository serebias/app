
  // Your web app's Firebase configuration
   var firebaseConfig = {
    apiKey: "AIzaSyCGiVOA8Mxr2ERZTHRtLcdIsx_sZD_IB_Q",
    authDomain: "banco-teste-ad802.firebaseapp.com",
    databaseURL: "https://banco-teste-ad802.firebaseio.com",
    projectId: "banco-teste-ad802",
    storageBucket: "banco-teste-ad802.appspot.com",
    messagingSenderId: "215938081904",
    appId: "1:215938081904:web:8051b6d0db70546b4cc0b5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();


  function signUp() {
    // body...
    var email = document.getElementById("email");
    var senha = document.getElementById("senha");

    const promise = auth.createUserWithEmailAndPassword(email.value, senha.value);
    promise.catch(e => alert(e.messsage));

    alert("Conta criada com sucesso !!!");
  }



  function signIn(){

    var email = document.getElementById("email");
    var senha = document.getElementById("senha");

    const promise = auth.signInWithEmailAndPassword(email.value, senha.value);
    promise.catch(e => alert(e.messsage));

    alert("Logado com " + email.value);

  }

  function signOut(){

    auth.signOut();
    alert("Deslogado");


  }

    /* auth.onAuthStateChanged(function(user){
          if (user){

            //logado
            var email = user.email;
            alert("Email logado " + email);

          }else{
    alert("Usuario deslogado");
           // não está logado
          }


      });*/

