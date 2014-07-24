#pragma strict

private var score : int = 0;
var fuel : int =0;
var maxfuel: int = 1;
var RocketFuel : GameObject;
var full = false;

var emptyLog : Texture;
var fullLog : Texture;

function Start () 
{
	Time.timeScale = 1;
	Screen.showCursor = false;
}

function AddPoints (points : int)
{
	score +=points;
}

function TakeFuel()
{
	if(fuel < maxfuel)
	{
		fuel +=1;
		RocketFuel.transform.SendMessage("PlayerFuel");
	}
	else{full = true;}
}

function useFuel ()
{
	fuel=0;
	full = false;
}

function RestartScore()
{
	score = 0;
}

function OnGUI()
{
	GUI.Label(Rect (10,10,300,100), "Score: " + score);
	if(fuel)
	{
		GUI.DrawTexture(Rect (Screen.width - 100, 100,64,64), fullLog);
	}
	else
	{
		GUI.DrawTexture(Rect (Screen.width - 100, 100,64,64), emptyLog);
	}
}