#pragma strict

var Spawner : GameObject;
var Comet : Transform;
var pos : Vector3;
var time : int;

function Start () 
{
	Spawner = GameObject.FindGameObjectWithTag("ShowSpawner");
	Spawner.SetActive(false);
	pos = transform.position;
	MakeComet();
}

function Update()
{
	pos = transform.position;
}

function MakeComet()
{
	for (;;)
	{
		time = Random.Range(1,5);
		yield WaitForSeconds(time);
		Instantiate( Comet, pos, Quaternion.identity);
	}
}