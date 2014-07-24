#pragma strict

function OnGUI()
{
	if(GUI.Button(Rect (Screen.width/2,100,100,50), "Start"))
	{
		Application.LoadLevel ("level_1");
	}
	if(GUI.Button(Rect(Screen.width/2,200,100,50), "Exit"))
	{
		Application.Quit();
	}
}