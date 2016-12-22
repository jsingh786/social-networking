<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class link_bookmark_groups
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="createdbyUsersLink_groups")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $link_groupsCreatedbyUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="assignedUsersLink_group")
     * @ORM\JoinColumn(name="assign_user_id", referencedColumnName="id", nullable=false)
     */
    private $link_groupsAssignedUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\user_bookmark_groups", inversedBy="user_groupsLink_groups")
     * @ORM\JoinColumn(name="user_groups_id", referencedColumnName="id", nullable=false)
     */
    private $link_groupsUser_groups;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getLink_groupsCreatedbyUser() {
		return $this->link_groupsCreatedbyUser;
	}

	public function setLink_groupsCreatedbyUser($link_groupsCreatedbyUser) {
		$this->link_groupsCreatedbyUser = $link_groupsCreatedbyUser;
	}

	public function getLink_groupsAssignedUser() {
		return $this->link_groupsAssignedUser;
	}

	public function setLink_groupsAssignedUser($link_groupsAssignedUser) {
		$this->link_groupsAssignedUser = $link_groupsAssignedUser;
	}

	public function getLink_groupsUser_groups() {
		return $this->link_groupsUser_groups;
	}

	public function setLink_groupsUser_groups($link_groupsUser_groups) {
		$this->link_groupsUser_groups = $link_groupsUser_groups;
	}

}