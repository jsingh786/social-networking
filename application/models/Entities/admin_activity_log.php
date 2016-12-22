<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class admin_activity_log
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $module;

    /**
     * @var datetime $created_at
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="adminActivityLog")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id")
     */
    private $ilookUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\admin", inversedBy="adminActivityLog")
     * @ORM\JoinColumn(name="admin_id", referencedColumnName="id")
     */
    private $admin;
    
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getModule() {
		return $this->module;
	}

	public function setModule($module) {
		$this->module = $module;
	}

	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

	public function getAdmin() {
		return $this->admin;
	}

	public function setAdmin($admin) {
		$this->admin = $admin;
	}

}