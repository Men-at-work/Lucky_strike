private var animator : Animator;
private var Target : Transform;
private var Distance;
private var lookAtDistance = 10.0;
var Damping = 3.0;
var underGround = true;
var rand : int = 0;
var fuel= 0;
var chek = true;

function Start ()
{
	Target = GameObject.Find("Player").transform;
	rand=1;
	animator = GetComponentInChildren(Animator);
	animator.SetBool("Alive",false);
}

function Update () 
{
	Distance = Vector3.Distance(Target.position, transform.position);
	
	if(Distance < lookAtDistance)
	{
	
		if(chek)
		{
			fuel = GameObject.Find("RocketFuel").GetComponent("rocketFuel").fuel;
			if(fuel == 0)
			{
				rand = Random.Range(1,5);
			}
			else if(fuel == 1)
			{
				rand = Random.Range(1,3);
			}
			else
			{
				rand = Random.Range(1,2);
			}
		}
		chek = false;
		
		if(rand==1)
		{
			animator.SetBool("Alive",true);
			lookAt();
			underGround = false;
		}
	}
	
	if(Distance > lookAtDistance)
	{
		if(!underGround)
		{
			animator.SetBool("Alive",false);
			underGround = true;
		}
		chek=true;
	}

	
}

function lookAt()
{
	var rotation = Quaternion.LookRotation(Target.position - transform.position);
	transform.rotation = Quaternion.Slerp(transform.rotation, rotation, Time.deltaTime * Damping);
}
