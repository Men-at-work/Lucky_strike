#pragma strict

private var Player : GameObject;
function Start()
{
	Player = GameObject.Find("Player");
}

function OnTriggerEnter(hit : Collider)
{
	if(hit.gameObject.tag == "Player")
	{
		Player.GetComponent(PlayerStats).TakeFuel();
		DestroyFuel();
	}
	
}

function DestroyFuel()
{
	if(!(Player.GetComponent(PlayerStats).full))
	{
		Destroy (gameObject, 0.2);
	}
}