<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class project
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $occupation;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $from_datee;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $url;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $team_members;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $descprition;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $to_datee;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersProject")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $projectsUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getName() {
		return $this->name;
	}

	public function setName($name) {
		$this->name = $name;
	}

	public function getOccupation() {
		return $this->occupation;
	}

	public function setOccupation($occupation) {
		$this->occupation = $occupation;
	}

	public function getFrom_datee() {
		return $this->from_datee;
	}

	public function setFrom_datee($from_datee) {
		$this->from_datee = $from_datee;
	}

	public function getUrl() {
		return $this->url;
	}

	public function setUrl($url) {
		$this->url = $url;
	}

	public function getTeam_members() {
		return $this->team_members;
	}

	public function setTeam_members($team_members) {
		$this->team_members = $team_members;
	}

	public function getDescprition() {
		return $this->descprition;
	}

	public function setDescprition($descprition) {
		$this->descprition = $descprition;
	}

	public function getTo_datee() {
		return $this->to_datee;
	}

	public function setTo_datee($to_datee) {
		$this->to_datee = $to_datee;
	}

	public function getProjectsUser() {
		return $this->projectsUser;
	}

	public function setProjectsUser($projectsUser) {
		$this->projectsUser = $projectsUser;
	}

}