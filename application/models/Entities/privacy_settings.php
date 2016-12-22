<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class privacy_settings
{
  /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $who_viewed_profile;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="privacySettings")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $ilookUser;
    
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getWho_viewed_profile() {
		return $this->who_viewed_profile;
	}

	public function setWho_viewed_profile($who_viewed_profile) {
		$this->who_viewed_profile = $who_viewed_profile;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

}