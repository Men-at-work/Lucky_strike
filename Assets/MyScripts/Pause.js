#pragma strict

var isPause = false;

function Update () 
{
	if(Input.GetKeyDown(KeyCode.Escape))
	{
		isPause = !isPause;
		if(isPause)
		{
			Time.timeScale = 0;
		}
		else
		{
			Time.timeScale = 1;
			Screen.showCursor = false;
			GetComponent(TP_Motor).enabled = true;
			GetComponent(TP_Controller).enabled = true;
			GameObject.Find("Camera").GetComponent(TP_Camera).enabled = true;
		}
	}
}

function OnGUI()
{
	if(isPause)
	{
		Screen.showCursor = true;
		GetComponent(TP_Motor).enabled = false;
		GetComponent(TP_Controller).enabled = false;
		GameObject.Find("Camera").GetComponent(TP_Camera).enabled = false;
		
		if(GUI.Button(Rect(Screen.width/2,100,100,50), "Restart"))
		{
			Application.LoadLevel("level_1");
		}
		if(GUI.Button(Rect(Screen.width/2,200,100,50), "Exit"))
		{
			Application.LoadLevel("menu");
		}
		
	}
}