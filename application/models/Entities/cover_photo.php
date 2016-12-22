<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class cover_photo
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=512, nullable=false)
     */
    private $name;

    /**
     * @ORM\Column(type="integer", length=4, nullable=false)
     */
    private $x_position;

    /**
     * @ORM\Column(type="integer", length=4, nullable=false)
     */
    private $y_position;

    /**
     * @ORM\OneToOne(targetEntity="Entities\ilook_user", inversedBy="coverPhoto")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false, unique=true)
     */
    private $ilookUser;
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

	public function getX_position() {
		return $this->x_position;
	}

	public function setX_position($x_position) {
		$this->x_position = $x_position;
	}

	public function getY_position() {
		return $this->y_position;
	}

	public function setY_position($y_position) {
		$this->y_position = $y_position;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

}