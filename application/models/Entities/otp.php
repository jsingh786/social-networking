<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class otp
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", nullable=false)
     */
    private $value;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $valid_upto;

    /**
     * @ORM\OneToOne(targetEntity="Entities\admin", inversedBy="otp")
     * @ORM\JoinColumn(name="admin_id", referencedColumnName="id", nullable=false, unique=true)
     */
    private $admin;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getValue() {
		return $this->value;
	}

	public function setValue($value) {
		$this->value = $value;
	}

	public function getValid_upto() {
		return $this->valid_upto;
	}

	public function setValid_upto($valid_upto) {
		$this->valid_upto = $valid_upto;
	}

	public function getAdmin() {
		return $this->admin;
	}

	public function setAdmin($admin) {
		$this->admin = $admin;
	}

}