<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class chat_settings
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $chat_on;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $read_receipt;
    
    /**
     * @ORM\Column(type="string", length=30, nullable=false)
     */
    private $openfire_password;

	/**
	 * @ORM\OneToOne(targetEntity="Entities\ilook_user", inversedBy="chatSettings")
	 * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", unique=true)
	 */
	private $ilookUser;
    
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getChat_on() {
		return $this->chat_on;
	}

	public function setChat_on($chat_on) {
		$this->chat_on = $chat_on;
	}

	public function getRead_receipt() {
		return $this->read_receipt;
	}

	public function setRead_receipt($read_receipt) {
		$this->read_receipt = $read_receipt;
	}
	public function getOpenfire_password() {
		return $this->openfire_password;
	}
	
	public function setOpenfire_password($openfire_password) {
		$this->openfire_password = $openfire_password;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}
	


}