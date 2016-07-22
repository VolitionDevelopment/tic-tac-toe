<?php
if(!empty($_POST['data'])){
    $data = $_POST['data'];
    $fname = "games.txt";

    $file = fopen("upload/" .$fname, 'w');//creates new file
    fwrite($file, $data);
    fclose($file);
}

$fname = "games.txt";

$file = fopen("games.txt", 'w');//creates new file
fwrite($file, "Hello, world!");
fclose($file);

echo "Hello World!";
?>