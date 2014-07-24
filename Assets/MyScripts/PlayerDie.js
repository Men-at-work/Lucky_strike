#pragma strict

private var pos : Vector3;
private var playerIsDead : boolean = false;

function Start()
{
	Screen.showCursor = false;
	pos = transform.position;
}
function OnCollisionEnter (hit : Collision)
{
	if(hit.gameObject.tag == "Comet_1")
	{
		PlayerDie();
	}
}

function PlayerDie()
{
	if(!TP_Animator.Instance.IsDead)
	{
		Screen.showCursor = true;
		playerIsDead = true;
		TP_Controller.Instance.Die();
	}

}

function OnGUI ()
{
	if(playerIsDead)
	{
		Screen.showCursor = true;
		if (GUI.Button(Rect(Screen.width*0.5 - 50, 200 -20 , 100, 40), "Restart"))
		{
			//PlayerRespown();
			Application.LoadLevel ("level_1");
		}
		if (GUI.Button(Rect(Screen.width*0.5 - 50, 250, 100, 40), "Exit"))
		{
			Application.LoadLevel ("menu");
		}
	}
}