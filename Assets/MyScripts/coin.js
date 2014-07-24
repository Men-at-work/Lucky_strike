#pragma strict

var points : int;
private var Player : GameObject;

function Start()
{
	points =25;
	Player = GameObject.Find("Player");
}

function OnTriggerEnter (hit : Collider)
{
	if(hit.gameObject.tag == "Player")
	{
		Player.transform.SendMessage("AddPoints",points);
		DestroyPoint();
	}
}

function DestroyPoint()
{	
	Destroy(gameObject,2);
}