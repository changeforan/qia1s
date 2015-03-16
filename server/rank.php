<?php
$con = mysql_connect("localhost","root","1990911Root");
if (!$con)
{
    die("Could not connect: " . mysql_error());
}
mysql_select_db("my_db_qia1s",$con);

$request = $_POST["action"];

if ($request == "insert") {

    $name = $_POST["name"];
    $points = $_POST["points"];
    $title = $_POST["title"];
    $sql = "insert into rank (name,points,title) VALUES ('$name','$points','$title')";
    mysql_query($sql,$con);
    echo("success");

}else{



    $result = mysql_query("select * from rank ORDER BY points DESC ");
    echo json_encode($result);



}
?>