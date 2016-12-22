<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class blog_categories
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
    private $name;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $status;

    /**
     * @ORM\OneToMany(targetEntity="Entities\blogs", mappedBy="blog_categories")
     */
    private $blogses;

    /**
     * @ORM\ManyToMany(targetEntity="Entities\ilook_user", mappedBy="blog_categorieses")
     */
    private $ilook_users;
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

	public function getStatus() {
		return $this->status;
	}

	public function setStatus($status) {
		$this->status = $status;
	}

	public function getBlogses() {
		return $this->blogses;
	}

	public function setBlogses($blogses) {
		$this->blogses = $blogses;
	}

	public function getIlook_users() {
		return $this->ilook_users;
	}

	public function setIlook_users($ilook_users) {
		$this->ilook_users = $ilook_users;
	}

}