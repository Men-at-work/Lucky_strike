#pragma strict

var points : int;
private var Player : GameObject;
var particle : ParticleEmitter;

function Start()
{	
	Player = GameObject.Find("Player");
}

function OnTriggerEnter (hit : Collider)
{
	if(hit.gameObject.tag == "Player")
	{
		DestroyParticle();
	}
}

function DestroyParticle()
{	
	gameObject.renderer.enabled = false;
	var halo : Component  = GetComponent("Halo"); 
	halo.GetType().GetProperty("enabled").SetValue(halo, false, null);
	
	particleSystem.Play();
}