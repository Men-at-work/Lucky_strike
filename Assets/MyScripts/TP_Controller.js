#pragma strict

static var ChController : CharacterController ;
static var Instance : TP_Controller;

function Awake () 
{
	ChController = GetComponent("CharacterController") as CharacterController;
	Instance = this;
	TP_Camera.UseExistingOrCreateNewMainCamera();
}

function Update () 
{
	if(Camera.main == null)
	{
		return;
	}
	if(!TP_Animator.Instance.IsDead)
	{
		GetLocomotionInput();
	}

	
	
	HandleActionInput();
	
	TP_Motor.Instance.UpdateMotor();
}

function GetLocomotionInput()
{
	

	var deadZone = 0.1f;
	
	TP_Motor.Instance.VerticalVelocity = TP_Motor.Instance.MoveVector.y;
	TP_Motor.Instance.MoveVector = Vector3.zero;
	
	if(Input.GetAxis("Vertical") > deadZone || Input.GetAxis("Vertical") < -deadZone)
	{
		TP_Motor.Instance.MoveVector += new Vector3 (0,0,Input.GetAxis("Vertical"));
	}
	
	if(Input.GetAxis("Horizontal") > deadZone || Input.GetAxis("Horizontal") < -deadZone)
	{
		TP_Motor.Instance.MoveVector += new Vector3 (Input.GetAxis("Horizontal"),0,0);
	}
	
	TP_Animator.Instance.DetermineCurrentMoveDirection();
}

function HandleActionInput()
{
	if(Input.GetButton("Jump"))
	{
		Jump();
	}
	if(Input.GetKeyDown(KeyCode.F1))
	{
		Die();
	}
}

private function Jump()
{
	TP_Motor.Instance.Jump();
	TP_Animator.Instance.Jump();
}

function Die()
{
	TP_Animator.Instance.Die();
}