<?php
    require_once(__DIR__ . "/../model/config.php");
    
    //an array is a series of objects so you can return all the information you
    //want in  one object
    $array = array(
        'exp'=> '',
        'exp1'=> '',
        'exp2'=> '',
        'exp3'=> '',
        'exp4'=> '',
    );
    
    
    $username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);
    
    //asking to select everything from a user's username
    $query = $_SESSION["connection"]->query("SELECT * FROM users WHERE BINARY username = '$username'");
    
    if($query->num_rows == 1){
        $row = $query->fetch_array();
        
        if($row["password"] === crypt($password , $row["salt"])){
            $_SESSION["authenticated"] = true;
             header("Location: " . $path . "index.php");
             //taking experience variable from the row
             // the row is all of the answers we got from the query
             //we're setting our array of experience to what our user's experience was just loaded
             $array["exp"] = $row["exp"];
             $array["exp1"] = $row["exp1"];
             $array["exp2"] = $row["exp2"];
             $array["exp3"] = $row["exp3"];
             $array["exp4"] = $row["exp4"];
             $_SESSION["name"] = $username; 
             //json is javascript object notation
             echo json_encode($array);
             
        }
        else{
            echo "<p>Invalid username or password1</p>";
        }
    }
    else{
            echo "<p>Invalid username or password2</p>";
    }