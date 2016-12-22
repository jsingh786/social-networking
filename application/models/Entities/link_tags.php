<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class link_tags
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="assignedUsersLink_tags")
     * @ORM\JoinColumn(name="assign_user_id", referencedColumnName="id", nullable=false)
     */
    private $link_tagsAssignedUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="createdbyUsesrLink_tag")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $link_tagsCreatedbyUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\user_tags", inversedBy="user_tagsLink_tags")
     * @ORM\JoinColumn(name="user_tags_id", referencedColumnName="id", nullable=false)
     */
    private $link_tagsUser_tags;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getLink_tagsAssignedUser() {
		return $this->link_tagsAssignedUser;
	}

	public function setLink_tagsAssignedUser($link_tagsAssignedUser) {
		$this->link_tagsAssignedUser = $link_tagsAssignedUser;
	}

	public function getLink_tagsCreatedbyUser() {
		return $this->link_tagsCreatedbyUser;
	}

	public function setLink_tagsCreatedbyUser($link_tagsCreatedbyUser) {
		$this->link_tagsCreatedbyUser = $link_tagsCreatedbyUser;
	}

	public function getLink_tagsUser_tags() {
		return $this->link_tagsUser_tags;
	}

	public function setLink_tagsUser_tags($link_tagsUser_tags) {
		$this->link_tagsUser_tags = $link_tagsUser_tags;
	}

}