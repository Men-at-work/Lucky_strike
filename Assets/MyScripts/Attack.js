private var animator : Animator;
private var Target : Transform;
private var Distance;
var attackRange =0.1;
var Damping = 3.0;

function Start ()
{
	Target = GameObject.Find("Player").transform;
	animator = GetComponent(Animator);
}

function Update () 
{
	Distance = Vector3.Distance(Target.position, transform.position);
	
	if(Distance > attackRange)
	{
		animator.SetBool("Angry",false);
	}
	
	if(Distance < attackRange)
	{
		animator.SetBool("Angry",true);
	}
	
}

function AttackDammage()
{
	if(Distance < attackRange)
	{
		GameObject.Find("Player").GetComponent("PlayerDie").PlayerDie();
	}
}