#pragma strict

var Player : GameObject;
var CameraP : GameObject;
var GameStats : GameObject;
private var inside = false;
var fuel: int = 0;
var playerFuel : int = 0;
var needFuel : int = 2;
var isWin = false;

function Start()
{
	Player = GameObject.Find("Player");
	CameraP = GameObject.Find("Camera");
}


function Update () 
{
	if(inside && Input.GetKey(KeyCode.F) && playerFuel)
	{
		Player.GetComponent(PlayerStats).useFuel();
		fuel += playerFuel;
		playerFuel = 0;
		if(fuel == needFuel)
		{
			isWin = true;
		}
	}
}

function OnGUI()
{
	if(isWin)
	{
		Screen.showCursor = true;
		Player.GetComponent(TP_Motor).enabled = false;
		Player.GetComponent(TP_Controller).enabled = false;
		CameraP.GetComponent(TP_Camera).enabled = false;
		
		GUI.Label(Rect (Screen.width/2, 10,100,50), "You Win!");
		if (GUI.Button(Rect(Screen.width*0.5 - 50, 200 -20 , 100, 40), "Restart"))
		{
			Application.LoadLevel ("level_1");
		}
		if (GUI.Button(Rect(Screen.width*0.5 - 50, 250, 100, 40), "Exit"))
		{
			Application.LoadLevel ("menu");
		}
	}
	
	GUI.Label(Rect(Screen.width-100,50,100,30), "Fuel: " + fuel +"/" + needFuel);
}

function GetFuel():int
{
	return fuel;
}

function PlayerFuel()
{
	playerFuel++;

}

function OnTriggerEnter(hit : Collider)
{
	if(hit.gameObject.tag == "Player")
	{
		inside = true;
	}
}

function OnTriggerExit (hit : Collider)
{
	if(hit.gameObject.tag == "Player")
	{
		inside = false;
	}
}