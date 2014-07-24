#pragma strict
import System;
import System.Runtime.Serialization.Formatters.Binary;
import System.IO;

public class GameStats extends MonoBehaviour{
	static var stats : GameStats;
	private var score : int = 0;

	function Awake () 
	{
		if(stats == null)
		{
			DontDestroyOnLoad(gameObject);
			stats = this;
		}
		else if(stats != this)
		{
			Destroy(gameObject);
		}
	}

	function AddScore(points : int)
	{
		score = points;
	}

	function Save()
	{	
		var bf : BinaryFormatter = new BinaryFormatter();
		var file : FileStream = File.Create(Application.persistentDataPath + "/playerInfo.dat");
		var data : PlayerData = new PlayerData();
		data.score = score;
		
		bf.Serialize(file, data);
		file.Close();
	}
	
	function Load()
	{
		if(File.Exists(Application.persistentDataPath + "/playerInfo.dat"))
		{
			var bf : BinaryFormatter = new BinaryFormatter();
			var file : FileStream = File.Open(Application.persistentDataPath + "/playerInfo.dat", FileMode.Open);
			var data : PlayerData = bf.Deserialize(file) as PlayerData;
			file.Close();
			
			score = data.score;
		}
	}
}

class PlayerData extends System.Object
{
	var score : int;
}
