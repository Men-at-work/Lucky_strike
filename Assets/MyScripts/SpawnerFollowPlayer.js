#pragma strict

var Player : GameObject;

function Start () 
{
	Player = GameObject.Find("Player");
}

function Update () 
{
	transform.position.x = Player.transform.position.x;
	transform.position.z = Player.transform.position.z;
}