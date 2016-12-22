<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class admin
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
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", unique=true, length=255, nullable=false)
     */
    private $email_id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $password;

    /**
     * @ORM\Column(type="integer", length=6, nullable=true)
     */
    private $six_digit_general_password;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $expiry_date;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $status;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $is_first_time_login;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $profile_picture;

    /**
     * @ORM\OneToOne(targetEntity="Entities\otp", mappedBy="admin", cascade={"remove"})
     */
    private $otp;
    
    /**
     * @ORM\OneToMany(targetEntity="Entities\admin_activity_log", mappedBy="admin", cascade={"remove"})
     */
    private $adminActivityLog;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\role", inversedBy="admin")
     * @ORM\JoinColumn(name="role_id", referencedColumnName="id")
     */
    private $role;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getFirstname() {
		return $this->firstname;
	}

	public function setFirstname($firstname) {
		$this->firstname = $firstname;
	}

	public function getLastname() {
		return $this->lastname;
	}

	public function setLastname($lastname) {
		$this->lastname = $lastname;
	}

	public function getEmail_id() {
		return $this->email_id;
	}

	public function setEmail_id($email_id) {
		$this->email_id = $email_id;
	}

	public function getPassword() {
		return $this->password;
	}

	public function setPassword($password) {
		$this->password = $password;
	}

	public function getSix_digit_general_password() {
		return $this->six_digit_general_password;
	}

	public function setSix_digit_general_password($six_digit_general_password) {
		$this->six_digit_general_password = $six_digit_general_password;
	}

	public function getExpiry_date() {
		return $this->expiry_date;
	}

	public function setExpiry_date($expiry_date) {
		$this->expiry_date = $expiry_date;
	}

	public function getStatus() {
		return $this->status;
	}

	public function setStatus($status) {
		$this->status = $status;
	}

	public function getIs_first_time_login() {
		return $this->is_first_time_login;
	}

	public function setIs_first_time_login($is_first_time_login) {
		$this->is_first_time_login = $is_first_time_login;
	}

	public function getProfile_picture() {
		return $this->profile_picture;
	}

	public function setProfile_picture($profile_picture) {
		$this->profile_picture = $profile_picture;
	}

	public function getOtp() {
		return $this->otp;
	}

	public function setOtp($otp) {
		$this->otp = $otp;
	}

	public function getRole() {
		return $this->role;
	}

	public function setRole($role) {
		$this->role = $role;
	}
	public function getAdminActivityLog() {
		return $this->adminActivityLog;
	}

	public function setAdminActivityLog($adminActivityLog) {
		$this->adminActivityLog = $adminActivityLog;
	}


}