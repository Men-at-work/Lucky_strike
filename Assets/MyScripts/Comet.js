#pragma strict

private var x : int =0;
private var y : int =0;
private var z : int =0;
private var force : int =0;

var Ruined : Transform;
var Cpos : Vector3;

function Start()
{
	force = Random.Range(1,1000);
	x = Random.Range(-1,1);
	y = Random.Range(-1,1);
	z = Random.Range(-1,1);
	rigidbody.AddForce (x*force,y*force,z*force);
}

function Update()
{
	Cpos = transform.position;
}

function OnCollisionEnter (hit : Collision)
{

	if(hit.gameObject.tag == "Floor")
	{
		DestroyObj();
	}
}


function DestroyObj()
{
	Instantiate(Ruined, Cpos, Quaternion.identity);
	Destroy (gameObject);
}