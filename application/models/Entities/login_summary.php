<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class login_summary
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $login_time;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $logout_time;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     */
    private $login_ip;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $country;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersLogin_summary")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id")
     */
    private $login_summarysUser;
    
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getLogin_time() {
		return $this->login_time;
	}

	public function setLogin_time($login_time) {
		$this->login_time = $login_time;
	}

	public function getLogout_time() {
		return $this->logout_time;
	}

	public function setLogout_time($logout_time) {
		$this->logout_time = $logout_time;
	}

	public function getLogin_ip() {
		return $this->login_ip;
	}

	public function setLogin_ip($login_ip) {
		$this->login_ip = $login_ip;
	}

	public function getCountry() {
		return $this->country;
	}

	public function setCountry($country) {
		$this->country = $country;
	}

	public function getLogin_summarysUser() {
		return $this->login_summarysUser;
	}

	public function setLogin_summarysUser($login_summarysUser) {
		$this->login_summarysUser = $login_summarysUser;
	}    
}