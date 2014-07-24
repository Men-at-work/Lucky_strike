#pragma strict

class MyType extends System.ValueType
{
 
	//fields
	var UpperLeft : Vector3;
	var UpperRight : Vector3;
	var LowerLeft : Vector3;
	var LowerRight : Vector3;
	 
	//Constructor 
	public function MyTyoe(ul:Vector3,ur:Vector3,ll:Vector3,lr:Vector3)
	{
		UpperLeft = ul;
		UpperRight = ur;
		LowerLeft = ll;
		LowerRight = lr;
	}
}