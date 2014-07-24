#pragma strict

static var Instance : TP_Motor;
enum Direction2 {Stationary, Forward, Backward, Left, Right, LeftForward, RightForward, LeftBackward, RightBackward};

var SlideSpeed : float = 10f;
var ForwardSpeed : float = 10f;
var BackwardSpeed : float = 2f;
var StrafingSpeed : float = 5f;
var JumpSpeed : float = 15f;
var Gravity : float = 21f;
var TerminalVelocity : float = 20f;
var SlideTreshold : float = 0.6f;
var MaxControllableSlideMagnitude : float = 0.4f;

private var slideDirection : Vector3;

var MoveVector : Vector3;
var VerticalVelocity : float;
var IsSliding : boolean;

function Awake () 
{
	Instance = this;
}

function UpdateMotor () 
{
	SnapAlignCharacterWithCamera();
	ProcessMotion();
}

function ProcessMotion()
{
	if(!TP_Animator.Instance.IsDead)
	{
		// Transform MoveVector to World Space
		MoveVector = transform.TransformDirection(MoveVector);
	}
	else
	{
		MoveVector = new Vector3(0,MoveVector.y,0);
	}
	
	// Normalize MoveVector of Magnitude > 1
	if(MoveVector.magnitude > 1)
	{
		MoveVector = Vector3.Normalize(MoveVector);
	}
	
	//Apply sliding if applicable
	ApplySlide();
	
	// Multiply MoveVector by MoveSpeed
	MoveVector *= MoveSpeed();
	
	//Reapply VerticalVelocity MoveVector
	MoveVector = new Vector3(MoveVector.x, VerticalVelocity, MoveVector.z);
	
	//Apply greavity
	ApplyGravity();
	
	// Move the Character in World Space
	TP_Controller.ChController.Move(MoveVector * Time.deltaTime);
}

function ApplyGravity()
{
	if(MoveVector.y > -TerminalVelocity)
	{
		MoveVector = new Vector3(MoveVector.x, MoveVector.y - Gravity * Time.deltaTime, MoveVector.z);
	}
	
	if(TP_Controller.ChController.isGrounded && MoveVector.y < -1)
	{	
		MoveVector = new Vector3(MoveVector.x, -1, MoveVector.z);
	}
}

function ApplySlide()
{
	if(!TP_Controller.ChController.isGrounded)
	{
		return;
	}
	
	slideDirection = Vector3.zero;
	var hitInfo : RaycastHit;
	
	if(Physics.Raycast(transform.position, Vector3.down, hitInfo))
	{
		
		if(hitInfo.normal.y < SlideTreshold)
		{
			slideDirection = new Vector3(hitInfo.normal.x, -hitInfo.normal.y, hitInfo.normal.z);
			if(!IsSliding)
			{
				TP_Animator.Instance.Slide();
			}
			IsSliding = true;
		}
		else
		{
			IsSliding = false;
		}
		
		if(slideDirection.magnitude < MaxControllableSlideMagnitude)
		{
			MoveVector += slideDirection;
		}
		else
		{
			MoveVector = slideDirection;
		}
	}
}

function Jump()
{
	if (TP_Controller.ChController.isGrounded)
	{
		VerticalVelocity = JumpSpeed;
	}
}

function SnapAlignCharacterWithCamera()
{
	if(MoveVector.x != 0 || MoveVector.z != 0)
	{
		transform.rotation = Quaternion.Euler(transform.eulerAngles.x, Camera.main.transform.eulerAngles.y, transform.eulerAngles.z);
	}
}

function MoveSpeed() : float
{
	var moveSpeed: float = 0f;
	
	switch (TP_Animator.Instance.MoveDirection)
	{
		case Direction.Stationary:
			moveSpeed = 0;
			break;
		case Direction.Forward:
			moveSpeed = ForwardSpeed;
			break;
		case Direction.Backward:
			moveSpeed = BackwardSpeed;
			break;
		case Direction.Left:
			moveSpeed = StrafingSpeed;
			break;
		case Direction.Right:
			moveSpeed = StrafingSpeed;
			break;
		case Direction.LeftForward:
			moveSpeed = ForwardSpeed;
			break;
		case Direction.RightForward:
			moveSpeed = ForwardSpeed;
			break;
		case Direction.LeftBackward:
			moveSpeed = BackwardSpeed;
			break;
		case Direction.RightBackward:
			moveSpeed = BackwardSpeed;
			break;
	}
	if(IsSliding)
	{
		moveSpeed = SlideSpeed;
	}
	
	return moveSpeed;
}