static var Instance : TP_Animator;

enum Direction {Stationary, Forward, Backward, Left, Right, LeftForward, RightForward, LeftBackward, RightBackward};

enum CharacterState {Idle, Running, WalkingBackwards, StrafingLeft, StrafingRight, Jumping, Falling, Landing, Sliding, Dead, ActionLocked}

var lastState : CharacterState;

var pelvis : Transform;
var spaceman : Transform;

var initialPosition : Vector3 = Vector3.zero;
var initialRotation : Quaternion = Quaternion.identity;
var ragdoll : GameObject;

var MoveDirection : Direction;
var State : CharacterState;
var IsDead : boolean;

function Awake () 
{
	Instance = this;
	
	//We are looking for our skeleton's root node in out case that is called "joints"
	//Ypur's may be different
	pelvis = transform.FindChild("Joints") as Transform;
	spaceman = transform.FindChild("Spaceman2") as Transform;
	initialPosition = transform.position;
	initialRotation = transform.rotation;
}

function Update () 
{
	DetermingCurrentState();
	ProcessCurrentState();
}

function DetermineCurrentMoveDirection()
{
	var forward = false;
	var backward = false;
	var left = false;
	var right = false;
	
	if(TP_Motor.Instance.MoveVector.z > 0)
	{
		forward = true;
	}
	if(TP_Motor.Instance.MoveVector.z < 0)
	{
		backward = true;
	}
	if(TP_Motor.Instance.MoveVector.x > 0)
	{
		right = true;
	}
	if(TP_Motor.Instance.MoveVector.x < 0)
	{
		left = true;
	}
	
	if(forward)
	{
		if(left)
		{
			MoveDirection = Direction.LeftForward;
		}
		else if(right)
		{
			MoveDirection = Direction.RightForward;
		}
		else
		{
			MoveDirection = Direction.Forward;
		}
	}
	else if(backward)
	{
		if(left)
		{
			MoveDirection = Direction.LeftBackward;
		}
		else if(right)
		{
			MoveDirection = Direction.RightBackward;
		}
		else
		{
			MoveDirection = Direction.Backward;
		}
	}
	else if(left)
	{
		MoveDirection = Direction.Left;
	}
	else if(right)
	{
		MoveDirection = Direction.Right;
	}
	else
	{
		MoveDirection = Direction.Stationary;
	}
}

function DetermingCurrentState()
{
	if(State == CharacterState.Dead)
	{
		return;
	}
	
	if(!TP_Controller.ChController.isGrounded)
	{
		if(State != CharacterState.Falling && State != CharacterState.Jumping && State != CharacterState.Landing)
		{
			//We shoud be falling 
		}
	}
	if(State != CharacterState.Falling && State != CharacterState.Jumping && State != CharacterState.Landing && State != CharacterState.Sliding)
	{
		switch (MoveDirection)
		{
			case Direction.Stationary:
				State = CharacterState.Idle;
				break;
			case Direction.Forward:
				State = CharacterState.Running;
				break;
			case Direction.Backward:
				State = CharacterState.WalkingBackwards;
				break;
			case Direction.Left:
				State = CharacterState.StrafingLeft;
				break;
			case Direction.Right:
				State = CharacterState.StrafingRight;
				break;
			case Direction.LeftForward:
				State = CharacterState.Running;
				break;
			case Direction.RightForward:
				State = CharacterState.Running;
				break;
			case Direction.LeftBackward:
				State = CharacterState.WalkingBackwards;
				break;
			case Direction.RightBackward:
				State = CharacterState.WalkingBackwards;
				break;
		}
	}
}

function ProcessCurrentState()
{
	switch (State)
	{
		case CharacterState.Idle:
			Idle();
			break;
		case CharacterState.Running:
			Running();
			break;
		case CharacterState.WalkingBackwards:
			WalkingBackwards();
			break;
		case CharacterState.StrafingLeft:
			StrafingLeft();
			break;
		case CharacterState.StrafingRight:
			StrafingRight();
			break;
		case CharacterState.Jumping:
			Jumping();
			break;
		case CharacterState.Falling:
			Falling();
			break;
		case CharacterState.Landing:
			Landing();
			break;
		case CharacterState.Sliding:
			Sliding();
			break;
		case CharacterState.Dead:
			Dead();
			break;
		case CharacterState.ActionLocked:
			break;
	}
}

function Idle()
{
	animation.CrossFade("Idle");
}

function Running()
{
	animation.CrossFade("Running");
}

function WalkingBackwards()
{
	animation.CrossFade("WalkingBackwards");
}

function StrafingLeft()
{
	animation.CrossFade("StrafingLeft");
}

function StrafingRight()
{
	animation.CrossFade("StrafingRight");
}

function Jumping()
{
	if((!animation.isPlaying && TP_Controller.ChController.isGrounded) || TP_Controller.ChController.isGrounded)
	{
		if(lastState == CharacterState.Running)
		{
			animation.CrossFade("RunLand");
		}
		else
		{
			animation.CrossFade("JumpLand");
		}
		State = CharacterState.Landing;
	}
	else if(!animation.IsPlaying("Jump"))
	{
		State = CharacterState.Falling;
		animation.CrossFade("Falling");
	}
	else
	{
		State = CharacterState.Jumping;
		//Help determing if we fell too far
	}
}

function Falling()
{
	if(TP_Controller.ChController.isGrounded)
	{
		if(lastState == CharacterState.Running)
		{
			animation.CrossFade("RunLand");
		}
		else
		{
			animation.CrossFade("JumpLand");
		}
		State = CharacterState.Landing;
	}
}

function Landing()
{
	if(lastState == CharacterState.Running)
	{
		if(!animation.IsPlaying("RunLand"))
		{
			State = CharacterState.Running;
			animation.Play("Running");
		}
	}
	else
	{
		if(!animation.IsPlaying("JumpLand"))
		{
			State = CharacterState.Idle;
			animation.Play("Idle");
		}
	}
}

function Sliding()
{
	if(!TP_Motor.Instance.IsSliding)
	{
		State = CharacterState.Idle;
		animation.CrossFade("Idle");
	}
}

function Dead()
{
	State = CharacterState.Dead;
}

function Jump()
{
	if(!TP_Controller.ChController.isGrounded || IsDead || State == CharacterState.Jumping)
	{
		return;
	}
	lastState = State;
	State = CharacterState.Jumping;
	animation.CrossFade("Jump");
}

function Fall()
{
	if(IsDead)
	{
		return;
	}
	
	lastState = State;
	State = CharacterState.Falling;
	// If we are to high do something
	animation.CrossFade("Falling");
}

function Slide()
{
	State = CharacterState.Sliding;
	animation.CrossFade("Falling");
}

function Die()
{
	//Initialize everything we need to die
	IsDead = true;
	SetupRegdoll();
	Dead();
	
}

function Reset()
{
	IsDead = false;
	transform.position = initialPosition;
	transform.rotation = initialRotation;
	State = CharacterState.Idle;
	animation.Play("Idle");
	ClearRagdoll();
}

function SetupRegdoll()
{
	if(ragdoll == null)
	{
		//Initiate a new ragdoll
		//match the character's pos and rot
		ragdoll = GameObject.Instantiate(Resources.Load("Ragdoll"), transform.position, transform.rotation) as GameObject;
	}
	
	//We are looking for our skeleton's root node in out case that is called "joints"
	//Ypur's may be different
	
	var characterPelvis = transform.FindChild("Spaceman2/Joints");
	var ragdollPelvis = ragdoll.transform.FindChild("Spaceman2/Joints");
	
	//match the regdoll's skeleton to the character skeleton
	MatchChildrenTransform(characterPelvis, ragdollPelvis);
	
	// we need to hide the character
	spaceman.renderer.enabled = false;
	
	//Tell the camera to lok at the ragdoll instand
	TP_Camera.Instance.TargetLookAt = ragdoll.transform.FindChild("Spaceman2/Joints/Body");
}

function ClearRagdoll()
{
	//Destroy the ragdoll
	if(ragdoll != null)
	{
		GameObject.Destroy(ragdoll);
		ragdoll =null;
	}
	
	// And show character again
	spaceman.renderer.enabled = true;
	
	//Tell the Camera to look at the character's lookAtTarget
	TP_Camera.Instance.TargetLookAt = transform.FindChild("targetLookAt");
}

function MatchChildrenTransform(source : Transform, target : Transform)
{
	// Narch through the skeleton hairarchy matching joint rotations 
	if(source.childCount > 0)
	{
		for (var sourceTransform : Transform in source.transform)
		{
			var targetTransform : Transform = target.Find(sourceTransform.name);
			
			if(targetTransform != null)
			{
				MatchChildrenTransform(source.transform, targetTransform);
				targetTransform.localPosition = sourceTransform.localPosition;
				targetTransform.localRotation = sourceTransform.localRotation;
			}
		}
	}
}