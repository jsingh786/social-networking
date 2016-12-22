<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class profile_visitors
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="visitorUsersProfile_visitor")
     * @ORM\JoinColumn(name="host_user_id", referencedColumnName="id", nullable=false)
     */
    private $profile_visitorsVisitorUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="hostUsersProfile_visitors")
     * @ORM\JoinColumn(name="visitor_user_id", referencedColumnName="id", nullable=false)
     */
    private $profile_visitorsHostUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getProfile_visitorsVisitorUser() {
		return $this->profile_visitorsVisitorUser;
	}

	public function setProfile_visitorsVisitorUser($profile_visitorsVisitorUser) {
		$this->profile_visitorsVisitorUser = $profile_visitorsVisitorUser;
	}

	public function getProfile_visitorsHostUser() {
		return $this->profile_visitorsHostUser;
	}

	public function setProfile_visitorsHostUser($profile_visitorsHostUser) {
		$this->profile_visitorsHostUser = $profile_visitorsHostUser;
	}

}