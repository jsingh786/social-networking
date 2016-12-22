<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class blocked_users
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="blockerUsers")
     * @ORM\JoinColumn(name="blocker_user_id", referencedColumnName="id")
     */
    private $ilookUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="blockedUsers")
     * @ORM\JoinColumn(name="blocked_user_id", referencedColumnName="id")
     */
    private $ilookUserr;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

	public function getIlookUserr() {
		return $this->ilookUserr;
	}

	public function setIlookUserr($ilookUserr) {
		$this->ilookUserr = $ilookUserr;
	}

}